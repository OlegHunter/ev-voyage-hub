import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const leadId = formData.get('leadId') as string;

    // Validation
    if (!file) throw new Error('No file provided');
    if (file.size > 5 * 1024 * 1024) throw new Error('File too large (max 5MB)');
    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type (allowed: jpg, png, pdf)');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Upload to Storage
    const fileName = `${leadId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('lead-attachments')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabaseClient
      .storage
      .from('lead-attachments')
      .getPublicUrl(fileName);

    // Save to lead_attachments table
    const { error: dbError } = await supabaseClient
      .from('lead_attachments')
      .insert({
        lead_id: leadId,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: urlData.publicUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

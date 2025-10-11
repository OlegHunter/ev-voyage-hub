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
    const formData = await req.json();
    
    // Validation
    if (!formData.phone) {
      throw new Error('Phone is required');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Generate lead_code (CH-2025-XXXXX)
    const lead_code = `CH-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Save to leads table
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .insert({
        lead_code,
        type: formData.type || 'general_inquiry',
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        message: formData.message || formData.comment,
        car_id: formData.car_id,
        source_page: formData.source_page || req.headers.get('referer'),
        utm_params: formData.utm || {},
        calc_snapshot: formData.calc_snapshot
      })
      .select()
      .single();

    if (leadError) throw leadError;

    // Call CRM API (stub for now)
    let crm_id = null;
    const CRM_API_URL = Deno.env.get('CRM_API_URL');
    const CRM_API_KEY = Deno.env.get('CRM_API_KEY');
    
    if (CRM_API_URL && CRM_API_KEY) {
      try {
        const crmResponse = await fetch(CRM_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CRM_API_KEY}`
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            source: 'car-hunter.com.ua',
            lead_code: lead_code
          })
        });

        const crmResult = await crmResponse.json();
        crm_id = crmResult.id || crmResult.lead_id;
        
        await supabaseClient
          .from('leads')
          .update({ crm_id })
          .eq('id', lead.id);
        
      } catch (crmError) {
        console.error('❌ CRM API error:', crmError);
      }
    }

    // Call Telegram notification
    try {
      const telegramResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-telegram-notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({
            leadData: {
              ...formData,
              lead_code,
              crm_id
            }
          })
        }
      );

      const telegramResult = await telegramResponse.json();
      
      await supabaseClient
        .from('leads')
        .update({
          telegram_sent: telegramResult.success,
          telegram_response: telegramResult
        })
        .eq('id', lead.id);

      if (!telegramResult.success) {
        await supabaseClient
          .from('failed_notifications')
          .insert({
            lead_id: lead.id,
            notification_type: 'telegram',
            payload: { leadData: formData },
            error_message: JSON.stringify(telegramResult.error),
            retry_count: 0
          });
      }
      
    } catch (telegramError) {
      console.error('❌ Telegram notification error:', telegramError);
      const errorMessage = telegramError instanceof Error ? telegramError.message : String(telegramError);
      
      await supabaseClient
        .from('failed_notifications')
        .insert({
          lead_id: lead.id,
          notification_type: 'telegram',
          payload: { leadData: formData },
          error_message: errorMessage,
          retry_count: 0
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead_code,
        lead_id: lead.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Process lead error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

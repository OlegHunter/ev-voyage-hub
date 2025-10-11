import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadData } = await req.json();
    
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram credentials not configured');
    }

    // Format message
    const message = `
🆕 <b>Новий лід CarHunter</b>

<b>Тип:</b> ${leadData.type || 'Загальний'}
<b>Ім'я:</b> ${leadData.name || 'Не вказано'}
<b>Телефон:</b> ${leadData.phone}
<b>Email:</b> ${leadData.email || 'Не вказано'}
<b>Коментар:</b> ${leadData.comment || 'Немає'}

${leadData.car_id ? `<b>Car ID:</b> ${leadData.car_id}` : ''}
${leadData.vin ? `<b>VIN:</b> ${leadData.vin}` : ''}

<b>Сторінка:</b> ${leadData.source_page || 'Не вказано'}
<b>LeadID:</b> ${leadData.lead_code || 'N/A'}
    `.trim();

    // Retry logic with exponential backoff
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: 'HTML'
            })
          }
        );

        const result = await response.json();
        
        if (result.ok) {
          console.log('✅ Telegram notification sent successfully');
          
          return new Response(
            JSON.stringify({ success: true, telegram_response: result }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          lastError = result;
          throw new Error(JSON.stringify(result));
        }
      } catch (error) {
        lastError = error;
        console.error(`❌ Attempt ${attempt + 1} failed:`, error);
        
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(3, attempt) * 1000));
        }
      }
    }

    throw new Error(`Failed after 3 attempts: ${JSON.stringify(lastError)}`);

  } catch (error) {
    console.error('❌ Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

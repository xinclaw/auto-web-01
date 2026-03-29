// Supabase Edge Function: /functions/v1/minimax
// Proxies requests to MiniMax API, bypassing CORS and IP restrictions

const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/text/chatcompletion_v2'
const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY') || 'sk-cp-zcSs-W2GX-CWRDKGcE1acXSlE17l-p6EBVg-1c7KiLSBz65J17jrHeZDoOPl4Jagp-DTdozuynKXgCvjRDfpOvB9d2tDgnEGvBGt26ogj5YCp2XkO4RyGgg'
const MODEL = 'MiniMax-M2.7'

Deno.serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed. Use POST.', raw: '' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  try {
    const { prompt, max_tokens: customMaxTokens } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing required field: prompt', raw: '' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Call MiniMax API
    const maxTokens = customMaxTokens || 200
    const miniMaxResponse = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    const responseText = await miniMaxResponse.text()
    let usage = null
    let resultText = responseText

    try {
      const parsed = JSON.parse(responseText)
      if (parsed.choices && parsed.choices[0]?.message?.content) {
        resultText = parsed.choices[0].message.content
      }
      if (parsed.usage) {
        usage = parsed.usage
      }
    } catch {
      // Response is not JSON, use raw text
    }

    if (!miniMaxResponse.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: `MiniMax API error: HTTP ${miniMaxResponse.status}`,
          raw: responseText
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({
        ok: true,
        text: resultText,
        raw: responseText,
        model: MODEL,
        usage: usage
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message || 'Unknown error', raw: '' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})

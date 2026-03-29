/**
 * Vercel API Route: /api/minimax
 * 
 * Receives a prompt from frontend and proxies to MiniMax API.
 * This bypasses the n8n cloud IP restriction issue.
 */

const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/text/chatcompletion_v2';
const MINIMAX_API_KEY = 'sk-cp-zcSs-W2GX-CWRDKGcE1acXSlE17l-p6EBVg-1c7KiLSBz65J17jrHeZDoOPl4Jagp-DTdozuynKXgCvjRDfpOvB9d2tDgnEGvBGt26ogj5YCp2XkO4RyGgg';
const MODEL = 'MiniMax-M2.7';

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed. Use POST.',
      raw: ''
    });
  }

  const { prompt, max_tokens: customMaxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required field: prompt',
      raw: ''
    });
  }

  try {
    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: customMaxTokens || 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    // Get raw text first
    const rawText = await response.text();
    console.log('[MiniMax API] Raw response:', rawText.slice(0, 500));

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      return res.status(200).json({
        ok: false,
        error: 'MiniMax returned non-JSON response',
        raw: rawText.slice(0, 500)
      });
    }

    // Check for API errors
    if (data.base_resp && data.base_resp.status_code !== 0) {
      return res.status(200).json({
        ok: false,
        error: `MiniMax error: ${data.base_resp.status_msg}`,
        raw: rawText.slice(0, 500)
      });
    }

    // Extract content from response
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

    if (!content) {
      return res.status(200).json({
        ok: false,
        error: 'No content in MiniMax response',
        raw: rawText.slice(0, 500)
      });
    }

    // Parse the JSON from the content (model returns JSON wrapped in markdown code block)
    let text = content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json({
          ok: true,
          text: parsed.title || parsed.content || parsed.text || content,
          raw: content.slice(0, 200),
          model: data.model,
          usage: data.usage
        });
      } catch (e) {
        // Not JSON, return as plain text
        return res.status(200).json({
          ok: true,
          text: content,
          raw: content.slice(0, 200),
          model: data.model,
          usage: data.usage
        });
      }
    } else {
      return res.status(200).json({
        ok: true,
        text: content,
        raw: content.slice(0, 200),
        model: data.model,
        usage: data.usage
      });
    }

  } catch (error) {
    console.error('[MiniMax API] Error:', error.message);
    return res.status(500).json({
      ok: false,
      error: `Request failed: ${error.message}`,
      raw: ''
    });
  }
};

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-client-api-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { provider, model, prompt, images } = req.body;
  const clientKey = req.headers['x-client-api-key'] || req.headers['x-client-api-key'];

  if (!provider || !model || !prompt) {
    return res.status(400).json({ error: 'Missing required parameters: provider, model, or prompt' });
  }

  try {
    if (provider === 'gemini') {
      const apiKey = clientKey || process.env.SABA_GEMINI_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API key is not configured. Please add it to Settings.' });
      }

      // Prepare contents parts
      const parts = [
        { text: prompt + "\n\nDraft the email based on this system prompt. Send only the final draft response. No extra markdown packaging." }
      ];

      // Add base64 images if any
      if (images && Array.isArray(images)) {
        images.forEach(img => {
          if (img.mimeType && img.data) {
            parts.push({
              inlineData: {
                mimeType: img.mimeType,
                data: img.data
              }
            });
          }
        });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ? data.error.message : 'Error calling Gemini API');
      }

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
      } else {
        throw new Error('No candidate content text returned from Gemini');
      }

    } else if (provider === 'openai') {
      const apiKey = clientKey || process.env.SABA_OPENAI_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key is not configured. Please add it to Settings.' });
      }

      // Prepare openai messages content parts
      const contentParts = [
        { type: 'text', text: prompt }
      ];

      // Add base64 images if any
      if (images && Array.isArray(images)) {
        images.forEach(img => {
          if (img.mimeType && img.data) {
            contentParts.push({
              type: 'image_url',
              image_url: {
                url: `data:${img.mimeType};base64,${img.data}`
              }
            });
          }
        });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'You are an elite empathetic business email architect assistant.' },
            { role: 'user', content: contentParts }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ? data.error.message : 'Error calling OpenAI API');
      }

      if (data.choices && data.choices[0].message.content) {
        return res.status(200).json({ text: data.choices[0].message.content });
      } else {
        throw new Error('No choice content returned from OpenAI');
      }

    } else {
      return res.status(400).json({ error: 'Unsupported provider: ' + provider });
    }

  } catch (error) {
    console.error('Backend generate error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

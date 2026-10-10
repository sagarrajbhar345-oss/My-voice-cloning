export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CARTESIA_API_KEY}`,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'sonic-2024-10-16',
        transcript: text,
        voice: {
          mode: 'id',
          id: 'b8e375b3-3576-4cb2-b3e7-3a4024092cf5'
        },
        output_format: {
          container: 'mp3',
          encoding: 'pcm_f32le',
          sample_rate: 44100
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Cartesia API Error:', errText);
      return res.status(response.status).json({ error: `Cartesia error: ${errText}` });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mp3');
    return res.send(buffer);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}

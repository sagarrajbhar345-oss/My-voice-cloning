export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;
  
  // Aapki Cloned Voice ID
  const VOICE_ID = "b8e375b3-3576-4cb2-b3e7-3a4024092cf5"; 

  try {
    const response = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "Cartesia-Version": "2024-06-10",
        "X-API-Key": CARTESIA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "sonic-multilingual",
        transcript: text,
        voice: { mode: "id", id: VOICE_ID },
        output_format: { container: "mp3", bit_rate: 128000, sample_rate: 44100 }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const titleMatches = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { texts } = req.body;

  if (!texts || texts.length === 0) {
    return res.status(400).json({ message: 'No texts provided for title matching' });
  }

  try {
    const matches = await Promise.all(
      texts.map(async (text) => {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: `Noisy OCR text from a book spine: ${text}\nReturn the most likely cleaned book title.`,
            },
          ],
        });

        return response.choices[0].message.content.trim();
      })
    );

    res.status(200).json({ matches });
  } catch (error) {
    console.error('Error fetching title matches:', error);
    res.status(500).json({ message: 'Failed to fetch title matches' });
  }
};

export default titleMatches;

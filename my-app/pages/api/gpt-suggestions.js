import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gptSuggestions = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { texts } = req.body;

  if (!texts || texts.length === 0) {
    return res.status(400).json({ message: 'No texts provided for suggestions' });
  }

  try {
    const suggestions = await Promise.all(
      texts.map(async (text) => {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Title: ${text}\nProvide the most likely book title based on the text.`
            }
          ],
        });

        return response.choices[0].message.content.trim();
      })
    );

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error fetching GPT suggestions:', error);
    res.status(500).json({ message: 'Failed to fetch GPT suggestions' });
  }
};

export default gptSuggestions;

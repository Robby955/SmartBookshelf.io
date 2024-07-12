// pages/api/generate-essay.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { book, minWords, style } = req.body;

  if (!book || !minWords || !style) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const prompt = `Write an essay about the book "${book}" in a ${style} style with at least ${minWords} words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const essay = response.choices[0].message.content;

    res.status(200).json({ essay });
  } catch (error) {
    console.error('Error generating essay:', error);
    res.status(500).json({ message: 'Failed to generate essay' });
  }
};

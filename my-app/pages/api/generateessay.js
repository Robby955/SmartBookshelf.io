// pages/api/generateEssay.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateEssay = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { book, minWords, maxWords, style, essayFormat, promptType, customKeyword } = req.body;

  if (!book || !minWords || !maxWords) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  let prompt = `Write an essay on ${book} with a word count between ${minWords} and ${maxWords}.`;
  if (essayFormat) {
    prompt += ` Format: ${essayFormat}.`;
  }
  if (style) {
    prompt += ` Style: ${style}.`;
  }
  if (promptType) {
    if (promptType === 'custom' && customKeyword) {
      prompt += ` Focus on the keyword '${customKeyword}'.`;
    } else {
      prompt += ` Focus on ${promptType}.`;
    }
  }

  try {
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

export default generateEssay;

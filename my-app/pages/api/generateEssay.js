import OpenAI from 'openai';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../credentials.json')),
  });
}

const db = getFirestore();

const generateEssay = async (req, res) => {
  console.log("Received request to generate essay");
  console.log("Request method:", req.method);

  if (req.method !== 'POST') {
    console.log("Invalid request method");
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { book, minWords, maxWords, style, essayFormat, promptType, customKeyword, userId } = req.body;

  console.log("Request body:", req.body);

  if (!book || !minWords || !maxWords || !userId) {
    console.log("Missing required parameters");
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

  console.log("Generated prompt:", prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI API response:", response);

    const essay = response.choices[0].message.content;

    console.log("Generated essay:", essay);

    // Save the essay to Firestore
    const essayDoc = db.collection('essays').doc();
    await essayDoc.set({
      userId,
      book,
      essay,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ essay });
  } catch (error) {
    console.error('Error generating essay:', error);
    res.status(500).json({ message: 'Failed to generate essay', error: error.message });
  }
};

export default generateEssay;

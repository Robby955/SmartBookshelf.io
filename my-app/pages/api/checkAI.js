import admin from 'firebase-admin';
import path from 'path';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(process.cwd(), 'credentials.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

const db = getFirestore();

const checkAI = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, userId } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'No text provided for AI content checking' });
  }

  try {
    // Placeholder for actual AI content checking logic
    const isAIContent = text.includes('AI') || text.includes('machine learning'); // Simplified example

    const result = {
      text,
      isAIContent,
      checkedAt: new Date(),
    };

    // Save result to Firestore
    if (userId) {
      await db.collection('aiHistory').add({
        ...result,
        userId,
      });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error checking AI content:', error);
    res.status(500).json({ message: 'Failed to check AI content' });
  }
};

export default checkAI;

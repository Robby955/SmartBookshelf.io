import admin from 'firebase-admin';

const serviceAccount = require('../../credentials.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const spellCheckHistory = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'No user ID provided' });
  }

  try {
    const historySnapshot = await db.collection('spellCheckHistory').where('userId', '==', userId).get();
    const history = historySnapshot.docs.map(doc => doc.data());

    res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

export default spellCheckHistory;

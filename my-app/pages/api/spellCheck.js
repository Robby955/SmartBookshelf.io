import admin from 'firebase-admin';
import axios from 'axios';

const serviceAccount = require('../../credentials.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const spellCheck = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, userId } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'No text provided for spell checking' });
  }

  try {
    // Call LanguageTool API for spell checking
    const response = await axios.post('https://api.languagetool.org/v2/check', {
      text,
      language: 'en-US'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const matches = response.data.matches;
    let correctedText = text;

    matches.forEach(match => {
      if (match.replacements && match.replacements.length > 0) {
        const replacement = match.replacements[0].value;
        const offset = match.offset;
        const length = match.length;
        correctedText = correctedText.substring(0, offset) + replacement + correctedText.substring(offset + length);
      }
    });

    const spellCheckResult = {
      text: correctedText,
      originalText: text,
      checkedAt: new Date().toISOString(),
      userId
    };

    // Save the result to Firestore
    await db.collection('spellCheckHistory').add(spellCheckResult);

    res.status(200).json({ result: correctedText });
  } catch (error) {
    console.error('Error checking spelling:', error);
    res.status(500).json({ message: 'Failed to check spelling' });
  }
};

export default spellCheck;

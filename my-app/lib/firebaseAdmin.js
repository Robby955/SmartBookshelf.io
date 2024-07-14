// lib/firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from '../credentials.json'; // Adjust the path as per your directory structure

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();

export { firestore };

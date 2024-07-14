import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app if not already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export default function withAdmin(Component) {
  return function AdminComponent(props) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const user = auth.currentUser;

      const checkAdmin = async () => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().isAdmin) {
            setIsAdmin(true);
          }
        }
        setLoading(false);
      };

      checkAdmin();
    }, []);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!isAdmin) {
      return <p>This feature is in progress</p>;
    }

    return <Component {...props} />;
  };
}

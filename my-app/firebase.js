import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const apps = getApps();
let firebaseApp;
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = apps[0];
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

// Initialize Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

// Enable offline data persistence
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error('Failed to enable offline data persistence:', err);
    } else if (err.code === 'unimplemented') {
      console.error('Offline data persistence is not available in this browser:', err);
    }
  });
}

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Auth functions
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      alert('Verification email sent. Please check your inbox.');
    }
  } catch (error) {
    handleAuthError(error);
  }
};

const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      alert('Verification email sent. Please check your inbox.');
    }
  } catch (error) {
    handleAuthError(error);
  }
};

const signInWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleAuthError(error);
  }
};

const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    alert('Verification email sent. Please check your inbox.');
  } catch (error) {
    handleAuthError(error);
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent. Please check your inbox.');
  } catch (error) {
    handleAuthError(error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error(error);
  }
};

const handleAuthError = async (error) => {
  if (error.code === 'auth/account-exists-with-different-credential') {
    const existingEmail = error.customData.email;
    const signInMethods = await fetchSignInMethodsForEmail(auth, existingEmail);
    alert(`An account already exists with the same email address but different sign-in credentials. Sign in using: ${signInMethods.join(', ')}`);
  } else {
    console.error(error);
    alert(error.message);  // Display a user-friendly error message
  }
};

export {
  auth,
  db,
  signInWithGoogle,
  signInWithGithub,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  logout,
};

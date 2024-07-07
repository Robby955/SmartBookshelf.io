import { initializeApp } from "firebase/app";
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
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuFLvTbB_f3ZkycBpTYMCdHsI-A3w86rU",
  authDomain: "smartbookshelf-6c6c4.firebaseapp.com",
  projectId: "smartbookshelf-6c6c4",
  storageBucket: "smartbookshelf-6c6c4.appspot.com",
  messagingSenderId: "795958126743",
  appId: "1:795958126743:web:your-app-id",
  measurementId: "G-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

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
  logout
};

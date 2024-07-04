import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
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

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.error(error);
    });
};

const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error(error);
    });
};

export { auth, db, signInWithGoogle, logout };

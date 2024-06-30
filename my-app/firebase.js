// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuFLvTbB_f3ZkycBpTYMCdHsI-A3w86rU",
  authDomain: "smartbookshelf-6c6c4.firebaseapp.com",
  projectId: "smartbookshelf-6c6c4",
  storageBucket: "smartbookshelf-6c6c4.appspot.com",
  messagingSenderId: "795958126743",
  appId: "1:795958126743:web:your-app-id",
  measurementId: "G-measurement-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
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

export { auth, signInWithGoogle, logout };

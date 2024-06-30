import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Initialize Firebase
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

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "elisadmin.firebaseapp.com",
  projectId: "elisadmin",
  storageBucket: "elisadmin.firebasestorage.app",
  messagingSenderId: "226055073510",
  appId: "1:226055073510:web:4edcb7e882b8dff10fd527",
  measurementId: "G-QHQ1SXYVFZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

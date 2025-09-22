import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCjdK6dA1WBiFvxFq2j52X7OMkFMELU2Tw",
  authDomain: "elisadmin.firebaseapp.com",
  projectId: "elisadmin",
  storageBucket: "elisadmin.appspot.com",
  messagingSenderId: "226055073510",
  appId: "1:226055073510:web:4edcb7e882b8dff10fd527",
  measurementId: "G-QHQ1SXYVFZ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your own Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4XtphSpBhUB2nsCXvyUDFUVYt_Z-KXVw",
  authDomain: "dermatgo.firebaseapp.com",
  projectId: "dermatgo",
  storageBucket: "dermatgo.firebasestorage.app",
  messagingSenderId: "47766193367",
  appId: "1:47766193367:web:20cba21cbbd022aa28dc92",
  measurementId: "G-SRNXYDDZYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
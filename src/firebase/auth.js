import {
  auth,
} from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut, // Renamed to avoid conflict
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export const handleEmailSignUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const handleEmailLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const handleGoogleSignIn = () => {
  return signInWithPopup(auth, googleProvider);
};

export const handleLogout = () => {
  return firebaseSignOut(auth);
};
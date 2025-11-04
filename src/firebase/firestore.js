import { db } from './config';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * Saves or updates user profile data (e.g., from the quiz).
 * @param {string} userId - The user's Firebase UID.
 * @param {object} data - The data to save.
 */
export const updateUserProfile = async (userId, data) => {
  if (!userId) return;
  const userDocRef = doc(db, 'users', userId);
  try {
    await setDoc(userDocRef, data, { merge: true });
    console.log("User profile updated!");
  } catch (error) {
    console.error("Error updating user profile: ", error);
  }
};

/**
 * Saves a generated AI routine to a user's collection.
 * @param {string} userId - The user's Firebase UID.
 * @param {object} routine - The AI-generated routine object.
 */
export const saveAiRoutine = async (userId, routine) => {
  if (!userId) return;
  const routinesColRef = collection(db, 'users', userId, 'savedRoutines');
  try {
    const docRef = await addDoc(routinesColRef, {
      ...routine,
      createdAt: new Date()
    });
    console.log("Routine saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving routine: ", error);
    throw error;
  }
};

/**
 * Saves a scanned product analysis to a user's collection.
 * @param {string} userId - The user's Firebase UID.
 * @param {object} product - The product analysis object.
 */
export const saveScannedProduct = async (userId, product) => {
  if (!userId) return;
  const productsColRef = collection(db, 'users', userId, 'savedProducts');
  try {
    const docRef = await addDoc(productsColRef, {
      ...product,
      scannedAt: new Date()
    });
    console.log("Product saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving product: ", error);
    throw error;
  }
};

/**
 * Fetches all saved routines for a user.
 * @param {string} userId - The user's Firebase UID.
 */
export const getSavedRoutines = async (userId) => {
  if (!userId) return [];
  const routinesColRef = collection(db, 'users', userId, 'savedRoutines');
  const q = query(routinesColRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetches all saved products for a user.
 * @param {string} userId - The user's Firebase UID.
 */
export const getSavedProducts = async (userId) => {
  if (!userId) return [];
  const productsColRef = collection(db, 'users', userId, 'savedProducts');
  const q = query(productsColRef, orderBy('scannedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY_FB,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN_FB,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID_FB,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_FB,
  messagingSenderId: process.env.NEXT_PUBLIC_MSG_SENDER_ID_FB,
  appId: process.env.NEXT_PUBLIC_APP_ID_FB,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID_FB,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export { storage };
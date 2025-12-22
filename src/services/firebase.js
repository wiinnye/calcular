import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgn6JOy2-ydxwXLRhkWn4C04JMl1SeIzE",
  authDomain: "planilhasaldo-190d1.firebaseapp.com",
  projectId: "planilhasaldo-190d1",
  storageBucket: "planilhasaldo-190d1.firebasestorage.app",
  messagingSenderId: "703176945010",
  appId: "1:703176945010:web:7fffc15ffcc89680c701eb",
  measurementId: "G-MKDTHP5VMD"

};



const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
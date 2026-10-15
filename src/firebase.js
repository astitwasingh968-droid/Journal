import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTJ1M2Di44DVeOuK3_0etikOxkARRFmVY",
  authDomain: "journal-project-32162.firebaseapp.com",
  databaseURL: "https://journal-project-32162-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "journal-project-32162",
  storageBucket: "journal-project-32162.firebasestorage.app",
  messagingSenderId: "287840144064",
  appId: "1:287840144064:web:3902eb6004873a239bbb25",
  measurementId: "G-83463VDP1T"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const EVENT_PATH = "archeryscoresheet/eventdata/EventName";
export const ENDS_PATH = "archeryscoresheet/eventdata/NoOfEnds";
export const VIEW_PATH = "archeryscoresheet/eventdata/Viewdata";
export const SCORE_PATH = "archeryscoresheet/scoredata";
export const ACCESS_PATH = "archeryscoresheet/accessdata";

import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db, ref, set, push, update, remove, onValue };

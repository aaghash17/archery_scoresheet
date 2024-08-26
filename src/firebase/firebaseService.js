// firebaseService.js
import { getDatabase, ref, onValue, set } from "firebase/database";
import App from "../firebase/firebaseConfig";

const db = getDatabase(App);

const getEventRef = () => ref(db, "archeryscoresheet/event");

export const setEventNameData = async (eventName) => {
  try {
    const eventRef = getEventRef();
    await set(eventRef, { eventName });
  } catch (error) {
    console.error("Failed to save data:", error.message);
    throw new Error("Failed to save data: " + error.message);
  }
};

export const subscribeToEventName = (callback) => {
  const eventRef = getEventRef();
  const unsubscribe = onValue(
    eventRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val().eventName || "");
      } else {
        callback(""); // Document does not exist, return empty data
      }
    },
    (error) => {
      console.error("Failed to load data:", error.message);
      callback(""); // Optionally handle or display the error
    }
  );

  return unsubscribe;
};

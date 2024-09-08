import { ref, onValue, set } from "firebase/database";
import { db, EVENT_PATH, ENDS_PATH } from "../firebase/firebaseConfig";

// Helper function to get a reference to the event data
const getEventRef = () => ref(db, EVENT_PATH);

// Helper function to get a reference to the NoofEnds data
const getNoofEndsRef = () => ref(db, ENDS_PATH);

// Function to set event name data
export const setEventNameData = async (eventName) => {
  try {
    const eventRef = getEventRef();
    await set(eventRef, { eventName });
  } catch (error) {
    console.error("Failed to save data:", error.message);
    throw new Error("Failed to save data: " + error.message);
  }
};

// Function to subscribe to event name updates
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

// Function to set NoofEnds data
export const setNoofEndsData = async (noOfEnds) => {
  try {
    const noOfEndsRef = getNoofEndsRef();
    await set(noOfEndsRef, { noOfEnds });
  } catch (error) {
    console.error("Failed to save data:", error.message);
    throw new Error("Failed to save data: " + error.message);
  }
};

// Function to subscribe to NoofEnds updates
export const subscribeToNoofEnds = (callback) => {
  const noOfEndsRef = getNoofEndsRef();
  const unsubscribe = onValue(
    noOfEndsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val().noOfEnds || "");
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

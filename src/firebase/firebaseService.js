import { ref, onValue, set, update, get } from "firebase/database";
import {
  db,
  EVENT_PATH,
  ENDS_PATH,
  SCORE_PATH,
} from "../firebase/firebaseConfig";

// Utility function to handle errors
const handleFirebaseError = (error) => {
  console.error("Firebase operation failed:", error.message);
  throw new Error("Firebase operation failed: " + error.message);
};

// Helper function to get a reference to Firebase data paths
const getFirebaseRef = (path) => ref(db, path);

// Function to set event name data
export const setEventNameData = async (eventName) => {
  try {
    const eventRef = getFirebaseRef(EVENT_PATH);
    await set(eventRef, { eventName });
  } catch (error) {
    handleFirebaseError(error);
  }
};

// Function to subscribe to event name updates
export const subscribeToEventName = (callback) => {
  const eventRef = getFirebaseRef(EVENT_PATH);
  const unsubscribe = onValue(
    eventRef,
    (snapshot) => {
      const eventName = snapshot.exists() ? snapshot.val().eventName || "" : "";
      callback(eventName);
    },
    (error) => {
      handleFirebaseError(error);
      callback(""); // Handle error in callback
    }
  );
  return unsubscribe;
};

// Function to set number of ends data
export const setNoofEndsData = async (noOfEnds) => {
  try {
    const noOfEndsRef = getFirebaseRef(ENDS_PATH);
    await set(noOfEndsRef, { noOfEnds });
  } catch (error) {
    handleFirebaseError(error);
  }
};

// Function to subscribe to number of ends updates
export const subscribeToNoofEnds = (callback) => {
  const noOfEndsRef = getFirebaseRef(ENDS_PATH);
  const unsubscribe = onValue(
    noOfEndsRef,
    (snapshot) => {
      const noOfEnds = snapshot.exists() ? snapshot.val().noOfEnds || "" : "";
      callback(noOfEnds);
    },
    (error) => {
      handleFirebaseError(error);
      callback(""); // Handle error in callback
    }
  );
  return unsubscribe;
};

// Function to subscribe to score data updates
export const subscribeToScoreData = (callback) => {
  const scoreRef = getFirebaseRef(SCORE_PATH);
  const unsubscribe = onValue(
    scoreRef,
    (snapshot) => {
      const scoreData = snapshot.exists() ? snapshot.val() || "" : "";
      callback(scoreData);
    },
    (error) => {
      handleFirebaseError(error);
      callback(""); // Handle error in callback
    }
  );
  return unsubscribe;
};

export const getScoreData = async (playerId) => {
  const scoreRef = getFirebaseRef(`${SCORE_PATH}/${playerId}`);

  try {
    const snapshot = await get(scoreRef); // Use the `get` function to retrieve the data
    if (snapshot.exists()) {
      return snapshot.val(); // Return the score data for the specific player
    } else {
      return {}; // Return an empty object if no data exists for the player
    }
  } catch (error) {
    handleFirebaseError(error); // Handle any errors
    return {}; // Return an empty object on error
  }
};

// Function to handle the score edit

export const handleScoreEdit = (id, field, value) => {
  const dataRef = ref(db, `${SCORE_PATH}/${id}`);
  return update(dataRef, { [field]: value })
    .then(() => {
      console.log(`Updated ${field} for row ${id}`);
    })
    .catch((error) => {
      handleFirebaseError(error);
    });
};

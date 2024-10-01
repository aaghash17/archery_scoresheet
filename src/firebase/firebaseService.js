import { ref, onValue, set, update, get, remove } from "firebase/database";
import {
  db,
  EVENT_PATH,
  ENDS_PATH,
  SCORE_PATH,
  ACCESS_PATH,
  VIEW_PATH,
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

// Function to set number of view table data
export const setViewTableData = async (length, time) => {
  try {
    const viewTableRef = getFirebaseRef(VIEW_PATH);
    await set(viewTableRef, { length, time });
  } catch (error) {
    handleFirebaseError(error);
  }
};

// Subscribe to view table data
export const subscribeToViewTableData = (callback) => {
  const viewTableRef = getFirebaseRef(VIEW_PATH);
  const unsubscribe = onValue(viewTableRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return unsubscribe; // Return unsubscribe function
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
  const scoreRef = playerId
    ? getFirebaseRef(`${SCORE_PATH}/${playerId}`)
    : getFirebaseRef(SCORE_PATH);

  try {
    const snapshot = await get(scoreRef); // Use the `get` function to retrieve the data
    if (snapshot.exists()) {
      return snapshot.val(); // Return the score data (either specific player or all)
    } else {
      return {}; // Return an empty object if no data exists
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

export const updateAccessData = async (boardsWithGUIDs) => {
  const accessRef = ref(db, ACCESS_PATH);

  // Clear existing data
  await remove(accessRef);

  // Prepare updates for new data
  const updates = {};
  boardsWithGUIDs.forEach(({ boardNumber, guid }) => {
    updates[`${guid}`] = { boardNumber };
  });

  // Update the database with the new board GUIDs
  await update(accessRef, updates);
};

export const getAccessData = async (guid) => {
  const accessRef = guid
    ? getFirebaseRef(`${ACCESS_PATH}/${guid}`)
    : getFirebaseRef(ACCESS_PATH);

  try {
    const snapshot = await get(accessRef); // Use the `get` function to retrieve the data
    if (snapshot.exists()) {
      return snapshot.val(); // Return the score data (either specific player or all)
    } else {
      return {}; // Return an empty object if no data exists
    }
  } catch (error) {
    handleFirebaseError(error); // Handle any errors
    return {}; // Return an empty object on error
  }
};

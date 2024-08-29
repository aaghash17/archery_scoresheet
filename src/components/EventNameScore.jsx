import { useState, useEffect } from "react";
import { subscribeToEventName } from "../firebase/firebaseService";

function EventNameScore() {
  const [eventName, setEventName] = useState("");
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToEventName((eventName) => {
      setEventName(eventName ?? ""); // Display the event name or empty string
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="header">
      <h2>{eventName}</h2>
    </div>
  );
}

export default EventNameScore;

import { useState, useEffect } from "react";
import { subscribeToEventName } from "../../firebase/firebaseService";

function EventName() {
  const [eventName, setEventName] = useState("");
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToEventName((eventName) => {
      setEventName(eventName ?? ""); // Display the event name or empty string
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return <> {eventName} </>;
}

export default EventName;

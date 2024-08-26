import { useState, useEffect } from "react";
import { subscribeToEventName } from "../firebase/firebaseService";
import "../components/datastyle.css";
import "../components/table.css";

function Datatable() {
  const [eventName, setEventName] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("none");

  // Handler to update the state when an option is selected
  const handleChange = (event) => {
    setSelectedBoard(event.target.value);
  };

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToEventName((eventName) => {
      setEventName(eventName ?? ""); // Display the event name or empty string
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="mobile">
      <div className="header">
        <h2>{eventName}</h2>
      </div>
      <div className="custom-select">
        <select value={selectedBoard} onChange={handleChange}>
          <option value="none" disabled hidden>
            Select a board
          </option>
          {[...Array(10)].map((_, index) => (
            <option key={index} value={`board-${index + 1}`}>
              Board-{index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Datatable;

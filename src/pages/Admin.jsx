import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  setEventNameData,
  subscribeToEventName,
} from "../firebase/firebaseService";
import Table from "../components/table";

function Admin() {
  const [eventName, setEventName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToEventName((eventName) => {
      setEventName(eventName || ""); // Display the event name or empty string
    });

    // Cleanup the listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const saveData = async () => {
    if (!eventName.trim()) {
      setError("Event name cannot be empty.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await setEventNameData(eventName);
      setSuccess("Data updated successfully!");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError("Failed to save data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission or other actions
      saveData(); // Call the saveData function when Enter is pressed
    }
  };

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-dark bg-primary rounded py-4">
        <div className="container text-center">
          <span className="navbar-brand mb-0 h1 my-margin-auto my-font-2rem">
            Admin Page
          </span>
        </div>
      </nav>
      <div className="container mt-4">
        <h4>Event Name</h4>
        {/* Display error and success messages */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            name="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onKeyDown={handleKeyDown} // Add the keydown handler here
            required
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={saveData}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <Table />
    </div>
  );
}

export default Admin;

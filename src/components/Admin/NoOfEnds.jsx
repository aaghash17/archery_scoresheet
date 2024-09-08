import { useState, useEffect } from "react";
import {
  setNoofEndsData,
  subscribeToNoofEnds,
} from "../../firebase/firebaseService";

function NoofEnds() {
  const [noOfEnds, setNoOfEnds] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToNoofEnds((newNoOfEnds) => {
      setNoOfEnds(newNoOfEnds || ""); // Update state with the latest no of ends
    });

    // Cleanup the listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const saveData = async () => {
    if (!noOfEnds.trim() || isNaN(noOfEnds)) {
      setError("NoofEnds must be a valid number.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await setNoofEndsData(Number(noOfEnds));
      setSuccess("Data updated successfully!");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError("Failed to save data: " + error.message);
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
    <div>
      <h4>NoofEnds</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          name="noOfEnds"
          value={noOfEnds}
          onChange={(e) => setNoOfEnds(e.target.value)}
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
  );
}

export default NoofEnds;

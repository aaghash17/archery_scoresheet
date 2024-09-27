import { useState, useEffect } from "react";
import {
  setNoofEndsData,
  subscribeToNoofEnds,
} from "../../firebase/firebaseService";

function NoofEnds() {
  const maxEnds = 12;
  const [noOfEnds, setNoOfEnds] = useState("");
  const [previousValidValue, setPreviousValidValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToNoofEnds((newNoOfEnds) => {
      setNoOfEnds(newNoOfEnds || ""); // Update state with the latest no of ends
      setPreviousValidValue(newNoOfEnds || ""); // Update previous valid value
    });

    // Cleanup the listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const saveData = async () => {
    const trimmedNoOfEnds = noOfEnds.trim();
    const numericValue = Number(trimmedNoOfEnds);

    if (!trimmedNoOfEnds || isNaN(numericValue)) {
      setError("NoofEnds must be a valid number.");
      setNoOfEnds(previousValidValue); // Revert to previous valid value
      return;
    }

    if (numericValue < 0 || numericValue > maxEnds) {
      setError(`NoofEnds must be between 0 and ${maxEnds}.`);
      setNoOfEnds(previousValidValue); // Revert to previous valid value
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await setNoofEndsData(numericValue);
      setPreviousValidValue(String(numericValue)); // Update previous valid value
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
      <div className="border p-3 rounded">
        <h4>NoofEnds</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control border"
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
    </div>
  );
}

export default NoofEnds;

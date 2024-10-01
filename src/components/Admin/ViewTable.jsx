import { useState, useEffect } from "react";
import {
  setViewTableData,
  subscribeToViewTableData,
} from "../../firebase/firebaseService";

function ViewTable() {
  const [length, setLength] = useState(""); // Initialized as an empty string
  const [time, setTime] = useState(""); // Initialized as an empty string
  const [previousValidData, setPreviousValidData] = useState({
    length: "",
    time: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToViewTableData((newData) => {
      setLength(String(newData.length || "")); // Ensure it's a string
      setTime(String(newData.time || "")); // Ensure it's a string
      setPreviousValidData({
        length: String(newData.length || ""),
        time: String(newData.time || ""),
      });
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const saveData = async () => {
    const trimmedLength = length.trim();
    const trimmedTime = time.trim();
    const numericLength = Number(trimmedLength);
    const numericTime = Number(trimmedTime);

    if (!trimmedLength || isNaN(numericLength)) {
      setError("Length must be a valid number.");
      setLength(previousValidData.length);
      return;
    }

    if (!trimmedTime || isNaN(numericTime)) {
      setError("Time must be a valid number.");
      setTime(previousValidData.time);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await setViewTableData(numericLength, numericTime);
      setPreviousValidData({
        length: String(numericLength),
        time: String(numericTime),
      });
      setSuccess("Data updated successfully!");

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
      e.preventDefault();
      saveData();
    }
  };

  return (
    <div>
      <div className="border p-3 rounded">
        <h4>View Table</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="input-group mb-3">
          <label htmlFor="length" className="input-group-prepend">
            <span className="input-group-text">Length</span>
          </label>
          <input
            id="length"
            type="number"
            className="form-control border"
            placeholder="Enter Length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            aria-describedby="lengthHelp"
          />
          <label htmlFor="time" className="input-group-prepend">
            <span className="input-group-text">Time</span>
          </label>
          <input
            id="time"
            type="number"
            className="form-control border"
            placeholder="Enter Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            aria-describedby="timeHelp"
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

export default ViewTable;

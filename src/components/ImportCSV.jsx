import PropTypes from "prop-types";
import Papa from "papaparse";
import { ref, set, push } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";
import { useState } from "react";

const ImportCSV = ({ onImport }) => {
  const [file, setFile] = useState(null);
  const [filename, setFileName] = useState(null);
  const [error, setError] = useState(null); // State to hold error messages

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.filename); // Use .name to get the file name
      setError(null); // Clear any previous error
    }
  };

  const handleImport = () => {
    if (!file) {
      setError("Please select a CSV file before importing.");
      return; // Exit the function if no file is selected
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        importData(results.data);
      },
      error: (error) => {
        console.error("Error reading CSV file:", error);
        setError("Error reading CSV file. Please try again.");
      },
    });
  };

  const importData = (data) => {
    const dataRef = ref(db, DATA_PATH);
    const updates = {};

    data.forEach((row) => {
      const newRowRef = push(dataRef);
      updates[newRowRef.key] = row;
      console.log(`Pushing data to ${newRowRef.key}:`, row); // Debugging log
    });

    Promise.all(
      Object.keys(updates).map(
        (key) => set(ref(db, DATA_PATH + `/${key}`), updates[key]) // Correct path
      )
    )
      .then(() => {
        console.log("Data imported successfully");
        if (onImport) onImport(); // Refresh or update the table

        // Reset file and filename state
        setFile(null);
        setFileName(null);

        // Reset file input field
        document.querySelector('input[type="file"]').value = null;
      })
      .catch((error) => {
        console.error("Error importing data:", error);
        setError("Error importing data. Please try again.");
      });
  };

  return (
    <>
      <h4>Import Data</h4>
      <div className="input-group mb-3">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="form-control mb-2"
          key={filename ? filename : "default"}
        />
        <button
          onClick={handleImport}
          className="btn btn-primary"
          type="button"
        >
          Import
        </button>
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}{" "}
      {/* Display error message */}
    </>
  );
};

// Validate that onImport is a function and is optional
ImportCSV.propTypes = {
  onImport: PropTypes.func,
};

export default ImportCSV;

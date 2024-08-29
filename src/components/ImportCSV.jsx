import PropTypes from "prop-types";
import Papa from "papaparse";
import { ref, set, push } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";
import { useState } from "react";

const ImportCSV = ({ onImport }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the file
  };

  const handleImport = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          importData(results.data);
        },
        error: (error) => {
          console.error("Error reading CSV file:", error);
        },
      });
    }
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
      })
      .catch((error) => {
        console.error("Error importing data:", error);
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
          key={file ? file.name : "default"} // Reset input value when file changes
        />
        <button
          onClick={handleImport}
          className="btn btn-primary"
          type="button"
        >
          Import
        </button>
      </div>
    </>
  );
};

// Validate that onImport is a function and is optional
ImportCSV.propTypes = {
  onImport: PropTypes.func,
};

export default ImportCSV;

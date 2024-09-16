import { useEffect, useState } from "react";
import { ref, update, push, remove } from "firebase/database";
import { db, SCORE_PATH } from "../../firebase/firebaseConfig";
import {
  subscribeToNoofEnds,
  subscribeToScoreData,
} from "../../firebase/firebaseService";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/DBTable.css";

const DbTable = () => {
  const [noOfEnds, setNoOfEnds] = useState("");
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null);

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

  let playerInfo = [
    "tboard",
    "tplayer",
    "name",
    "district",
    "age",
    "sex",
    "bow",
  ];
  let playerTotal = ["total"];

  let playerScore = [];

  for (let i = 1; i <= noOfEnds; i++) {
    for (let j = 1; j <= 3; j++) {
      playerScore.push(`d${i}${j}`);
    }
  }

  const columnOrder = [...playerInfo, ...playerTotal, ...playerScore];

  useEffect(() => {
    const unsubscribe = subscribeToScoreData((scoreData) => {
      if (scoreData) {
        const formattedData = Object.keys(scoreData).map((key) => ({
          id: key,
          ...scoreData[key],
        }));
        setData(formattedData);
      } else {
        setData([]); // Set to an empty array if no data
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleAddRow = () => {
    const newRow = {
      tboard: "",
      tplayer: "",
      name: "",
      district: "",
      age: "",
      sex: "",
      bow: "",
      total: 0,
    };
    const newRowRef = ref(db, SCORE_PATH);
    push(newRowRef, newRow)
      .then(() => console.log("Added new row"))
      .catch((error) => {
        setError("Error adding new row: " + error.message);
        console.error("Error adding new row:", error);
      });
  };

  const handleRemoveSelectedRows = () => {
    selectedRows.forEach((id) => {
      remove(ref(db, `${SCORE_PATH}/${id}`))
        .then(() => console.log(`Removed row with id ${id}`))
        .catch((error) => {
          setError("Error removing row: " + error.message);
          console.error("Error removing row:", error);
        });
    });
    setSelectedRows([]);
  };

  const handleRemoveAllRows = () => {
    const dataRef = ref(db, SCORE_PATH);
    remove(dataRef)
      .then(() => {
        console.log("Removed all rows");
        setData([]); // Clear local state after removal
      })
      .catch((error) => {
        setError("Error removing all rows: " + error.message);
        console.error("Error removing all rows:", error);
      });
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleEdit = (id, field, value) => {
    const dataRef = ref(db, `${SCORE_PATH}/${id}`);
    update(dataRef, { [field]: value })
      .then(() => console.log(`Updated ${field} for row ${id}`))
      .catch((error) => {
        setError("Error updating data: " + error.message);
        console.error("Error updating data:", error);
      });
  };

  const handleChange = (id, field, event) => {
    handleEdit(id, field, event.target.value);
  };

  return (
    <div className="container mt-4">
      <h4>Database Table</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleAddRow}>
          Add Row
        </button>
        <button
          className="btn btn-danger me-2"
          onClick={handleRemoveSelectedRows}
          disabled={selectedRows.length === 0}
        >
          Remove Selected Rows
        </button>
        <button className="btn btn-danger" onClick={handleRemoveAllRows}>
          Remove All Rows
        </button>
      </div>
      <div className="table-container">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Select</th>
              {columnOrder.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                  />
                </td>
                {columnOrder.map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      className="form-control"
                      value={item[field] || ""}
                      onChange={(e) => handleChange(item.id, field, e)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DbTable;

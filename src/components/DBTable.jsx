// src/TableComponent.jsx
import { useEffect, useState } from "react";
import { ref, onValue, update, push, remove } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/DBTable.css";

const DBTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null);

  const columnOrder = [
    "tboard",
    "tplayer",
    "name",
    "district",
    "age",
    "sex",
    "bow",
    "total",
    "d11",
    "d12",
    "d13",
    "d21",
    "d22",
    "d23",
    "d31",
    "d32",
    "d33",
    "d41",
    "d42",
    "d43",
    "d51",
    "d52",
    "d53",
    "d61",
    "d62",
    "d63",
    "d71",
    "d72",
    "d73",
    "d81",
    "d82",
    "d83",
    "d91",
    "d92",
    "d93",
    "d101",
    "d102",
    "d103",
  ];

  useEffect(() => {
    const dataRef = ref(db, DATA_PATH);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setData(formattedData);
        } else {
          initializeData();
        }
      },
      (error) => {
        setError("Error fetching data: " + error.message);
        console.error("Firebase data fetch error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const initializeData = () => {
    const defaultRow = {
      tboard: "",
      tplayer: "",
      name: "",
      district: "",
      age: "",
      sex: "",
      bow: "",
      total: 0,
      d11: "",
      d12: "",
      d13: "",
      d21: "",
      d22: "",
      d23: "",
      d31: "",
      d32: "",
      d33: "",
      d41: "",
      d42: "",
      d43: "",
      d51: "",
      d52: "",
      d53: "",
      d61: "",
      d62: "",
      d63: "",
      d71: "",
      d72: "",
      d73: "",
      d81: "",
      d82: "",
      d83: "",
      d91: "",
      d92: "",
      d93: "",
      d101: "",
      d102: "",
      d103: "",
    };
    const dataRef = ref(db, DATA_PATH);
    push(dataRef, defaultRow)
      .then(() => console.log("Initialized default data"))
      .catch((error) => {
        setError("Error initializing data: " + error.message);
        console.error("Error initializing data:", error);
      });
  };

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
      d11: "",
      d12: "",
      d13: "",
      d21: "",
      d22: "",
      d23: "",
      d31: "",
      d32: "",
      d33: "",
      d41: "",
      d42: "",
      d43: "",
      d51: "",
      d52: "",
      d53: "",
      d61: "",
      d62: "",
      d63: "",
      d71: "",
      d72: "",
      d73: "",
      d81: "",
      d82: "",
      d83: "",
      d91: "",
      d92: "",
      d93: "",
      d101: "",
      d102: "",
      d103: "",
    };
    const newRowRef = ref(db, DATA_PATH);
    push(newRowRef, newRow)
      .then(() => console.log("Added new row"))
      .catch((error) => {
        setError("Error adding new row: " + error.message);
        console.error("Error adding new row:", error);
      });
  };

  const handleRemoveSelectedRows = () => {
    selectedRows.forEach((id) => {
      remove(ref(db, `${DATA_PATH}/${id}`))
        .then(() => console.log(`Removed row with id ${id}`))
        .catch((error) => {
          setError("Error removing row: " + error.message);
          console.error("Error removing row:", error);
        });
    });
    setSelectedRows([]);
  };

  const handleRemoveAllRows = () => {
    const dataRef = ref(db, DATA_PATH);
    remove(dataRef)
      .then(() => console.log("Removed all rows"))
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
    const dataRef = ref(db, `${DATA_PATH}/${id}`);
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

export default DBTable;

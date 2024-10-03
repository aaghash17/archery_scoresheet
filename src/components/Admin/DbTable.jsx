import { useState, useMemo, useCallback, useEffect } from "react";
import { ref, update, push, remove } from "firebase/database";
import { db, SCORE_PATH } from "../../firebase/firebaseConfig";
import { subscribeToScoreData } from "../../firebase/firebaseService";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/DBTable.css";

import { FaSortUp, FaSortDown } from "react-icons/fa";

let playerInfo = [
  "tboard",
  "tplayer",
  "name",
  "district",
  "age",
  "sex",
  "bow",
  "total",
];

const DbTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState(null);
  const [columnWidths, setColumnWidths] = useState([
    50, 50, 50, 200, 200, 75, 75, 100, 50,
  ]);
  const [filterField, setFilterField] = useState(playerInfo[0]);
  const [filterValue, setFilterValue] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  let playerSelect = ["Select"];
  const columnOrder = [...playerSelect, ...playerInfo];

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

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

  //Table functions

  const requestSort = (key) => {
    let direction = "ascending";

    // Check if the current column is the same as the previous one
    if (sortConfig && sortConfig.key === key) {
      direction =
        sortConfig.direction === "ascending" ? "descending" : "ascending";
    } else {
      direction = "ascending"; // Default to ascending if a new column is sorted
    }

    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item[filterField]
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  }, [data, filterField, filterValue]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];

    if (sortConfig !== null && sortConfig.direction !== null) {
      return [...sortableItems].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Check if the keys exist
        if (!(sortConfig.key in a) || !(sortConfig.key in b)) {
          aValue = aValue ?? 0; // Use default value
          bValue = bValue ?? 0; // Use default value
        }

        // Convert to number if key is "total" or "tboard"
        if (sortConfig.key === "total" || sortConfig.key === "tboard") {
          aValue = Number(aValue) || 0; // Convert and default to 0 if NaN
          bValue = Number(bValue) || 0; // Convert and default to 0 if NaN
        }

        // General comparison logic
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [filteredData, sortConfig]);

  const handleMouseMove = useCallback(
    (e) => {
      if (isResizing && currentColumn !== null) {
        const newWidth = Math.max(
          50,
          columnWidths[currentColumn] + (e.clientX - initialMouseX)
        );
        setColumnWidths((prev) => {
          const newWidths = [...prev];
          newWidths[currentColumn] = newWidth;
          return newWidths;
        });
        setInitialMouseX(e.clientX);
      }
    },
    [isResizing, currentColumn, initialMouseX, columnWidths]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setCurrentColumn(null);
  }, []);

  const handleMouseDown = (index, e) => {
    setIsResizing(true);
    setCurrentColumn(index);
    setInitialMouseX(e.clientX);
    e.preventDefault();
  };

  const handleResetFilter = () => {
    setFilterValue("");
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="container mt-4">
      <h2>Database Table</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mt-4">
        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="border p-3 rounded w-100">
            <h4>Filter By:</h4>
            <div className="d-flex">
              <select
                id="filterField"
                className="form-select me-2"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                {playerInfo.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control border"
                placeholder={`Enter ${filterField}`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary mt-2"
              onClick={handleResetFilter}
            >
              Reset Filter
            </button>
          </div>
        </div>
        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="border p-3 rounded w-100">
            <h4>Add/Remove Row</h4>
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
        </div>
      </div>
      <div className="d-flex align-items-center mb-3">
        <button
          className="btn btn-secondary me-3"
          onClick={() => setSortConfig(null)}
        >
          Cancel Sort
        </button>
        <div
          className="d-flex align-items-center p-2 bg-secondary text-white"
          style={{
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            display: "inline-block",
          }}
        >
          <div>
            <span>&nbsp;&nbsp;</span>
          </div>
          <div className="form-check form-switch form-check-lg">
            <input
              className="form-check-input"
              type="checkbox"
              id="editModeSwitch"
              checked={isEditing}
              onChange={toggleEditMode}
              style={{ transform: "scale(1.5)" }}
            />
            <label
              className="form-check-label ms-2 text-white"
              htmlFor="editModeSwitch"
            >
              {isEditing ? "Edit - ON" : "Edit - OFF"}
            </label>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              {columnOrder.map((header, index) => (
                <th
                  key={index}
                  className="text-center"
                  style={{ position: "sticky", top: 0, zIndex: 10 }}
                >
                  <span
                    onClick={() =>
                      requestSort(header.toLowerCase().replace(/ /g, ""))
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {header}
                    {sortConfig &&
                      sortConfig.key ===
                        header.toLowerCase().replace(/ /g, "") &&
                      (sortConfig.direction === "ascending" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      ))}
                  </span>
                  <div
                    onMouseDown={(e) => handleMouseDown(index, e)}
                    style={{
                      cursor: "ew-resize",
                      width: "5px",
                      display: "inline-block",
                      height: "100%",
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.id}>
                {columnOrder.map((field) => (
                  <td key={field}>
                    {field === "Select" ? (
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    ) : isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={item[field] || ""}
                        onChange={(e) => handleChange(item.id, field, e)}
                      />
                    ) : (
                      <div className="text-center">{item[field]}</div>
                    )}
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

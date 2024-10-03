// src/ResizableSortableTable.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSortUp, FaSortDown } from "react-icons/fa";

// Sample data with more fields
const initialData = [
  {
    id: 1,
    name: "Alice",
    age: 25,
    email: "alice@example.com",
    city: "New York",
    occupation: "Engineer",
    phone: "123-456-7890",
    gender: "Female",
    registrationDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Bob",
    age: 30,
    email: "bob@example.com",
    city: "San Francisco",
    occupation: "Designer",
    phone: "234-567-8901",
    gender: "Male",
    registrationDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Charlie",
    age: 22,
    email: "charlie@example.com",
    city: "Los Angeles",
    occupation: "Artist",
    phone: "345-678-9012",
    gender: "Male",
    registrationDate: "2023-03-10",
  },
  {
    id: 4,
    name: "David",
    age: 35,
    email: "david@example.com",
    city: "Chicago",
    occupation: "Chef",
    phone: "456-789-0123",
    gender: "Male",
    registrationDate: "2023-04-05",
  },
  {
    id: 5,
    name: "Eve",
    age: 28,
    email: "eve@example.com",
    city: "Miami",
    occupation: "Teacher",
    phone: "567-890-1234",
    gender: "Female",
    registrationDate: "2023-05-30",
  },
];

const ResizableSortableTable = () => {
  const [data] = useState(initialData);
  const [sortConfig, setSortConfig] = useState(null);
  const [columnWidths, setColumnWidths] = useState([
    150, 100, 200, 200, 150, 150, 150, 150, 200,
  ]);
  const [filterField, setFilterField] = useState("name");
  const [filterValue, setFilterValue] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [initialMouseX, setInitialMouseX] = useState(0);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
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
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
      <h2>Resizable Sortable Table</h2>
      <div className="mb-3">
        <label htmlFor="filterField" className="form-label">
          Filter By:
        </label>
        <select
          id="filterField"
          className="form-select mb-2"
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="email">Email</option>
          <option value="city">City</option>
          <option value="occupation">Occupation</option>
          <option value="phone">Phone</option>
          <option value="gender">Gender</option>
          <option value="registrationDate">Registration Date</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder={`Enter ${filterField}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <button className="btn btn-secondary mt-2" onClick={handleResetFilter}>
          Reset Filter
        </button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            {[
              "Name",
              "Age",
              "Email",
              "City",
              "Occupation",
              "Phone",
              "Gender",
              "Registration Date",
            ].map((header, index) => (
              <th
                key={index}
                style={{ width: columnWidths[index], position: "relative" }}
              >
                <span
                  onClick={() =>
                    requestSort(header.toLowerCase().replace(/ /g, ""))
                  }
                  style={{ cursor: "pointer" }}
                >
                  {header}
                  {sortConfig &&
                    sortConfig.key === header.toLowerCase().replace(/ /g, "") &&
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
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.email}</td>
              <td>{item.city}</td>
              <td>{item.occupation}</td>
              <td>{item.phone}</td>
              <td>{item.gender}</td>
              <td>{item.registrationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResizableSortableTable;

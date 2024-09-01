import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import DbTable from "../components/Admin/DbTable";
import EventName from "../components/Admin/EventName";
import ImportCSV from "../components/Admin/ImportCSV";
import ExportCSV from "../components/Admin/ExportCSV";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { useState } from "react";

function Admin() {
  const [data, setData] = useState([]);
  const handleImport = () => {
    // Refetch data from Firebase after import
    const dataRef = ref(db, "data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setData(formattedData);
      }
    });
  };

  return (
    <>
      <div className="container mt-4">
        <nav className="navbar navbar-dark bg-primary rounded py-4">
          <div className="container d-flex justify-content-center">
            <span className="navbar-brand mb-0 h1 my-font-2rem">
              Admin Page
            </span>
          </div>
        </nav>

        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6 mb-4">
              <EventName />
            </div>
            <div className="col-md-6 mb-4">
              <ImportCSV onImport={handleImport} />
            </div>
          </div>
        </div>
        <div className="container mt-4">
          <ExportCSV data={data} />
        </div>
        <DbTable />
      </div>
    </>
  );
}

export default Admin;

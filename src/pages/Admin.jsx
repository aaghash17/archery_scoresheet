import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import DbTable from "../components/Admin/DbTable";
import EventName from "../components/Admin/EventName";
import NoofEnds from "../components/Admin/NoofEnds";
import ImportCSV from "../components/Admin/ImportCSV";
import ExportCSV from "../components/Admin/ExportCSV";
import Access from "../components/Admin/Access";
import ViewTable from "../components/Admin/ViewTable";
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

        {/* Bootstrap Tabs */}
        <ul className="nav nav-tabs mt-4" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link active"
              id="event-tab"
              data-bs-toggle="tab"
              href="#event"
              role="tab"
              aria-controls="event"
              aria-selected="true"
            >
              Event Details
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link"
              id="db-table-tab"
              data-bs-toggle="tab"
              href="#db-table"
              role="tab"
              aria-controls="db-table"
              aria-selected="false"
            >
              Database Table
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link"
              id="access-tab"
              data-bs-toggle="tab"
              href="#access"
              role="tab"
              aria-controls="access"
              aria-selected="false"
            >
              Access Manager
            </a>
          </li>
        </ul>

        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="event"
            role="tabpanel"
            aria-labelledby="event-tab"
          >
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <EventName />
              </div>
              <div className="col-md-6 mb-4">
                <NoofEnds />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <ViewTable />
              </div>
            </div>
          </div>

          <div
            className="tab-pane fade"
            id="db-table"
            role="tabpanel"
            aria-labelledby="db-table-tab"
          >
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <ImportCSV onImport={handleImport} />
              </div>
              <div className="col-md-6 mb-4">
                <ExportCSV data={data} />
              </div>
            </div>
            <DbTable />
          </div>

          <div
            className="tab-pane fade"
            id="access"
            role="tabpanel"
            aria-labelledby="access-tab"
          >
            <Access />
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;

import Papa from "papaparse";
import { ref, get } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";

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

const ExportCSV = () => {
  const handleExport = () => {
    const dataRef = ref(db, DATA_PATH);

    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => {
            const item = data[key];
            // Remove the 'id' field if it exists
            delete item.id;

            // Rearrange the columns based on columnOrder
            const orderedItem = {};
            columnOrder.forEach((col) => {
              orderedItem[col] = item[col] || ""; // Default to empty string if the column is missing
            });

            return orderedItem;
          });

          // Convert JSON to CSV
          const csv = Papa.unparse(formattedData, {
            header: true,
            columns: columnOrder, // Specify column order
          });

          // Create a downloadable link
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "data.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error("No data found");
        }
      })
      .catch((error) => {
        console.error("Error exporting data:", error);
      });
  };

  return (
    <>
      <h4>Export Data</h4>
      <button className="btn btn-success" onClick={handleExport}>
        Export to CSV
      </button>
    </>
  );
};

export default ExportCSV;

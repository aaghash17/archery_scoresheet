import Papa from "papaparse";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

const ExportCSV = () => {
  const handleExport = () => {
    const dataRef = ref(db, "data");

    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => {
            const item = data[key];
            // Remove the 'id' field
            delete item.id;
            return item;
          });

          // Convert JSON to CSV
          const csv = Papa.unparse(formattedData);

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
    <button className="btn btn-success" onClick={handleExport}>
      Export to CSV
    </button>
  );
};

export default ExportCSV;

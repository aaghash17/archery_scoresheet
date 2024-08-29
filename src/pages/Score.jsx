import { useState, useEffect } from "react";
import EventNameScore from "../components/EventNameScore";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import "../css/Scoredatastyle.css";
import "../css/Scoretable.css";

function Score() {
  const [selectedBoard, setSelectedBoard] = useState(null); // Start with null or undefined
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    // Reference to the database path where boards are stored
    const boardsRef = ref(db, "archeryscoresheet/data");

    // Fetch data from Firebase
    onValue(boardsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Extract and process board numbers from the data
        const boardNumbers = Object.values(data) // Get all values from the data object
          .map((item) => item.tboard) // Extract 'tboard' field, which is a string
          .map((boardNumberString) => Number(boardNumberString)) // Convert string to number
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .sort((a, b) => a - b); // Sort numbers

        // Update state with unique board numbers
        setBoards(boardNumbers);
      }
    });
  }, []);

  useEffect(() => {
    // Log the selected board number whenever it changes
    if (selectedBoard !== null) {
      console.log(`Selected board number: ${selectedBoard}`);
    }
  }, [selectedBoard]);

  const handleChange = (event) => {
    // Extract number from the selected value
    const selectedValue = event.target.value;
    const boardNumber = Number(selectedValue.replace("board-", ""));
    setSelectedBoard(boardNumber);
  };

  return (
    <div className="mobile">
      <EventNameScore />
      <div className="custom-select">
        <select
          value={selectedBoard !== null ? `board-${selectedBoard}` : "none"}
          onChange={handleChange}
        >
          <option value="none" disabled hidden>
            Select a board
          </option>
          {boards.map((boardNumber) => (
            <option key={boardNumber} value={`board-${boardNumber}`}>
              Board-{boardNumber}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Score;

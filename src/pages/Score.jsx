import { useState, useEffect } from "react";
import EventNameScore from "../components/EventNameScore";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import "../css/Scoredatastyle.css";
import "../css/Scoretable.css";

function Score() {
  const [selectedBoard, setSelectedBoard] = useState(null); // Numeric value of selected board
  const [selectedValue, setSelectedValue] = useState("");
  const [boards, setBoards] = useState([]);
  const [players, setPlayers] = useState([]); // State to store players

  useEffect(() => {
    // Fetch all boards from Firebase
    const boardsRef = ref(db, "archeryscoresheet/data");

    onValue(boardsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const boardNumbers = Object.values(data)
          .map((item) => Number(item.tboard)) // Extract and convert 'tboard' field to number
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .sort((a, b) => a - b); // Sort numbers

        setBoards(boardNumbers);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedBoard !== null) {
      // Fetch players for the selected board
      const playersRef = ref(db, "archeryscoresheet/data");

      onValue(playersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const playerList = Object.values(data)
            .filter((item) => Number(item.tboard) === selectedBoard) // Filter by selected board
            .map((item) => item.tplayer); // Extract 'tplayer' field

          setPlayers(playerList);
        } else {
          setPlayers([]); // Handle case where no players are found
        }
      });
    } else {
      setPlayers([]); // Clear players if no board is selected
    }
  }, [selectedBoard]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const boardNumber = Number(selectedValue.replace("board-", ""));
    setSelectedBoard(boardNumber);
  };

  const handleradioChange = (event) => {
    setSelectedValue(event.target.value);
    // Call fetchvalue or any additional logic here
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
      <div>
        <h3>Players for Board-{selectedBoard}</h3>
        <ul>
          {players.length > 0 ? (
            players.map((player, index) => <li key={index}>{player}</li>)
          ) : (
            <li>No players found</li>
          )}
        </ul>
      </div>
      <div className="warpper">
        <input
          className="radio"
          id="one"
          value="A"
          name="group"
          type="radio"
          checked={selectedValue === "A"}
          onChange={handleradioChange}
        />
        <input
          className="radio"
          id="two"
          value="B"
          name="group"
          type="radio"
          checked={selectedValue === "B"}
          onChange={handleradioChange}
        />
        <input
          className="radio"
          id="three"
          value="C"
          name="group"
          type="radio"
          checked={selectedValue === "C"}
          onChange={handleradioChange}
        />
        <input
          className="radio"
          id="four"
          value="D"
          name="group"
          type="radio"
          checked={selectedValue === "D"}
          onChange={handleradioChange}
        />

        <div className="tabs">
          <label className="tab" htmlFor="one">
            A
          </label>
          <label className="tab" htmlFor="two">
            B
          </label>
          <label className="tab" htmlFor="three">
            C
          </label>
          <label className="tab" htmlFor="four">
            D
          </label>
        </div>
      </div>
    </div>
  );
}

export default Score;

import React, { useState, useEffect } from "react";
import EventNameScore from "../components/EventNameScore";
import { ref, onValue } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";
import "../css/Scoredatastyle.css";
import "../css/Scoretable.css";

function Score() {
  const [selectedBoard, setSelectedBoard] = useState(null); // Numeric value of selected board
  const [selectedPlayer, setSelectedPlayer] = useState(""); // Selected radio button value
  const [boards, setBoards] = useState([]);
  const [players, setPlayers] = useState([]); // State to store players

  useEffect(() => {
    // Fetch all boards from Firebase
    const boardsRef = ref(db, DATA_PATH);

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
      const playersRef = ref(db, DATA_PATH);

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
    setSelectedPlayer(event.target.value);
    console.log(`Selected Player: ${event.target.value}`);
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
      <div className="wrapper">
        {players.length > 0 ? (
          <div className="tabs">
            {players.map((player) => (
              <React.Fragment key={player}>
                <input
                  className="radio"
                  id={`radio-${player}`}
                  type="radio"
                  name="group"
                  value={player}
                  checked={selectedPlayer === player}
                  onChange={handleradioChange}
                />
                <label className="tab" htmlFor={`radio-${player}`}>
                  {player}
                </label>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>No board selected</p>
        )}
      </div>
    </div>
  );
}

export default Score;

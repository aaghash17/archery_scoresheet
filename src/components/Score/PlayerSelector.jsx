import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { ref, onValue } from "firebase/database"; // Ensure onValue is imported
import { db, DATA_PATH } from "../../firebase/firebaseConfig";

function PlayerSelector({ onBoardChange, onPlayerSelect }) {
  const [boards, setBoards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);

  // Fetch all boards from Firebase
  useEffect(() => {
    const boardsRef = ref(db, DATA_PATH);
    const unsubscribe = onValue(
      boardsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const boardNumbers = Array.from(
            new Set(Object.values(data).map((item) => Number(item.tboard)))
          ).sort((a, b) => a - b);
          setBoards(boardNumbers);
        }
      },
      (error) => console.error("Error fetching boards:", error)
    );
    return () => unsubscribe();
  }, []);

  // Fetch players for the selected board
  useEffect(() => {
    if (selectedBoard !== null) {
      const playersRef = ref(db, DATA_PATH);
      const unsubscribe = onValue(
        playersRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const playerList = Object.keys(data)
              .filter((key) => Number(data[key].tboard) === selectedBoard)
              .map((key) => ({
                id: key,
                ...data[key],
              }));
            setPlayers(playerList);
          } else {
            setPlayers([]);
          }
        },
        (error) => console.error("Error fetching players:", error)
      );
      return () => unsubscribe();
    } else {
      setPlayers([]);
    }
  }, [selectedBoard]);

  // Handle board change
  const handleBoardChange = (event) => {
    const selectedValue = event.target.value;
    const boardNumber = Number(selectedValue.replace("board-", ""));
    setSelectedBoard(boardNumber);
    onBoardChange(boardNumber);
  };

  // Handle player selection change
  const handlePlayerChange = (event) => {
    const playerId = event.target.value;
    onPlayerSelect(playerId);
  };

  return (
    <>
      <div className="custom-select">
        <select
          value={selectedBoard !== null ? `board-${selectedBoard}` : "none"}
          onChange={handleBoardChange}
          aria-label="Select a board"
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
      <br></br>
      <div className="wrapper">
        {players.length > 0 ? (
          <div className="tabs">
            {players.map((player) => (
              <React.Fragment key={player.id}>
                <input
                  className="radio"
                  id={`radio-${player.id}`}
                  type="radio"
                  name="group"
                  value={player.id}
                  onChange={handlePlayerChange}
                />
                <label className="tab" htmlFor={`radio-${player.id}`}>
                  {player.tplayer}
                </label>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>No board selected</p>
        )}
      </div>
    </>
  );
}

// Define prop types
PlayerSelector.propTypes = {
  onBoardChange: PropTypes.func.isRequired,
  onPlayerSelect: PropTypes.func.isRequired,
};

export default PlayerSelector;

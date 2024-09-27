import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function PlayerSelector({
  scoreData,
  accessBoard,
  onBoardChange,
  onPlayerSelect,
}) {
  const [boards, setBoards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Fetch all boards from scoreData
  useEffect(() => {
    if (scoreData) {
      const boardNumbers = Array.from(
        new Set(Object.values(scoreData).map((item) => Number(item.tboard)))
      ).sort((a, b) => a - b);

      if (accessBoard == null || accessBoard === 0) {
        setBoards(boardNumbers);
      } else if (boardNumbers.includes(accessBoard)) {
        setBoards([accessBoard]);
      }
    }

    if (selectedBoard !== null) {
      if (scoreData) {
        const playerList = Object.keys(scoreData)
          .filter((key) => Number(scoreData[key].tboard) === selectedBoard)
          .map((key) => ({
            id: key,
            ...scoreData[key],
          }));
        setPlayers(playerList);
      } else {
        setPlayers([]);
      }
    } else {
      setPlayers([]);
    }
  }, [scoreData, selectedBoard, accessBoard]);

  // Handle board change
  const handleBoardChange = (event) => {
    const selectedValue = event.target.value;
    const boardNumber = Number(selectedValue.replace("board-", ""));
    setSelectedBoard(boardNumber);
    setSelectedPlayer(null); // Reset selected player when board changes
    onBoardChange(boardNumber);
  };

  // Handle player selection change
  const handlePlayerChange = (event) => {
    const playerId = event.target.value;
    setSelectedPlayer(playerId); // Update selected player state
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
      <br />
      <div className="wrapper">
        {players.length > 0 ? (
          <>
            <div className="tabs">
              {players.map((player) => (
                <React.Fragment key={player.id}>
                  <input
                    className="radio"
                    id={`radio-${player.id}`}
                    type="radio"
                    name="group"
                    value={player.id}
                    checked={selectedPlayer === player.id}
                    onChange={handlePlayerChange}
                  />
                  <label className="tab" htmlFor={`radio-${player.id}`}>
                    {player.tplayer}
                  </label>
                </React.Fragment>
              ))}
            </div>
            {selectedPlayer === null && (
              <>
                <br></br>
                <p>No player selected</p>
              </>
            )}
          </>
        ) : (
          <p>No board selected</p>
        )}
      </div>
    </>
  );
}

// Define prop types
PlayerSelector.propTypes = {
  scoreData: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  accessBoard: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onBoardChange: PropTypes.func.isRequired,
  onPlayerSelect: PropTypes.func.isRequired,
};

export default PlayerSelector;

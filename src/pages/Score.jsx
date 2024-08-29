import React, { useState, useEffect, useCallback } from "react";
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
  const [playerDetails, setPlayerDetails] = useState({
    name: "",
    age: "",
    bow: "",
    district: "",
    sex: "",
  }); // State to store the selected player's details

  useEffect(() => {
    // Fetch all boards from Firebase
    const boardsRef = ref(db, DATA_PATH);

    const unsubscribe = onValue(
      boardsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const boardNumbers = Object.values(data)
            .map((item) => Number(item.tboard)) // Extract and convert 'tboard' field to number
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .sort((a, b) => a - b); // Sort numbers

          setBoards(boardNumbers);
        }
      },
      (error) => {
        console.error("Error fetching boards:", error);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  useEffect(() => {
    if (selectedBoard !== null) {
      // Fetch players for the selected board
      const playersRef = ref(db, DATA_PATH);

      const unsubscribe = onValue(
        playersRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const playerList = Object.values(data)
              .filter((item) => Number(item.tboard) === selectedBoard) // Filter by selected board
              .map((item) => item.tplayer); // Extract 'tplayer' field

            setPlayers(playerList);
          } else {
            setPlayers([]); // Handle case where no players are found
          }
        },
        (error) => {
          console.error("Error fetching players:", error);
        }
      );

      return () => unsubscribe(); // Cleanup subscription on component unmount
    } else {
      setPlayers([]); // Clear players if no board is selected
    }
  }, [selectedBoard]);

  useEffect(() => {
    if (selectedBoard !== null && selectedPlayer) {
      // Fetch the details for the selected player
      const playerRef = ref(db, DATA_PATH);

      const unsubscribe = onValue(
        playerRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const playerData = Object.values(data).find(
              (item) =>
                Number(item.tboard) === selectedBoard &&
                item.tplayer === selectedPlayer
            );

            if (playerData) {
              setPlayerDetails({
                name: playerData.name || "",
                age: playerData.age || "",
                bow: playerData.bow || "",
                district: playerData.district || "",
                sex: playerData.sex || "",
              }); // Set the player's details
            } else {
              setPlayerDetails({
                name: "",
                age: "",
                bow: "",
                district: "",
                sex: "",
              }); // Clear details if player not found
            }
          }
        },
        (error) => {
          console.error("Error fetching player details:", error);
        }
      );

      return () => unsubscribe(); // Cleanup subscription on component unmount
    } else {
      setPlayerDetails({
        name: "",
        age: "",
        bow: "",
        district: "",
        sex: "",
      }); // Clear details if board or player is not selected
    }
  }, [selectedBoard, selectedPlayer]);

  const handleChange = useCallback((event) => {
    const selectedValue = event.target.value;
    const boardNumber = Number(selectedValue.replace("board-", ""));
    setSelectedBoard(boardNumber);
  }, []);

  const handleradioChange = useCallback((event) => {
    setSelectedPlayer(event.target.value);
    console.log(`Selected Player: ${event.target.value}`);
  }, []);

  return (
    <div className="mobile">
      <EventNameScore />
      <div className="custom-select">
        <select
          value={selectedBoard !== null ? `board-${selectedBoard}` : "none"}
          onChange={handleChange}
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
        {playerDetails.name && (
          <div>
            <div className="person-details">
              <div className="group-2">
                <div className="group-2-text">
                  <label id="pname">{playerDetails.name}</label>
                </div>
                <div className="group-2-text">
                  <label id="district">{playerDetails.district}</label>
                </div>
                <div className="group-2-text">
                  <label id="age">{playerDetails.age}</label>
                </div>
                <div className="group-2-text">
                  <label id="sex">{playerDetails.sex}</label>
                </div>
                <div className="group-2-text">
                  <label id="bow">{playerDetails.bow}</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="table-scoresheet">
        <div className="table-heading">
          <div className="table-heading1">
            <div className="frame-1">
              <div className="_text">S.No</div>
            </div>
            <div className="frame-2">
              <div className="_text">Score</div>
            </div>
            <div className="frame-3">
              <div className="_text">Sum</div>
            </div>
          </div>
          <div className="table-heading2">
            <div className="frame-4">
              <div className="_text">1</div>
            </div>
            <div className="frame-4">
              <div className="_text">2</div>
            </div>
            <div className="frame-4">
              <div className="_text">3</div>
            </div>
          </div>
          <div className="table-data">
            <div className="row-1">
              <div className="c-sno">
                <div className="_text">1</div>
              </div>
              <div className="c-1">
                <input type="number" id="d11" />
              </div>
              <div className="c-2">
                <input type="number" id="d12" />
              </div>
              <div className="c-3">
                <input type="number" id="d13" />
              </div>
              <div className="c-sum">
                <div className="_text">
                  <label id="s1"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Score;

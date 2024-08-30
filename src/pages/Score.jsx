import React, { useState, useEffect, useCallback } from "react";
import EventNameScore from "../components/EventNameScore";
import { ref, onValue, update } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";
import "../css/Scoredatastyle.css";
import "../css/Scoretable.css";

function Score() {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [boards, setBoards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playerDetails, setPlayerDetails] = useState({
    name: "",
    age: "",
    bow: "",
    district: "",
    sex: "",
    scores: { d11: "", d12: "", d13: "" },
  });

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

  // Fetch the details for the selected player
  useEffect(() => {
    if (selectedPlayerId) {
      const playerRef = ref(db, `${DATA_PATH}/${selectedPlayerId}`);
      const unsubscribe = onValue(
        playerRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setPlayerDetails((prevDetails) => ({
              ...prevDetails,
              name: data.name || prevDetails.name,
              age: data.age || prevDetails.age,
              bow: data.bow || prevDetails.bow,
              district: data.district || prevDetails.district,
              sex: data.sex || prevDetails.sex,
              scores: {
                d11: data.d11 || prevDetails.scores.d11,
                d12: data.d12 || prevDetails.scores.d12,
                d13: data.d13 || prevDetails.scores.d13,
              },
            }));
          }
        },
        (error) => console.error("Error fetching player details:", error)
      );
      return () => unsubscribe();
    } else {
      setPlayerDetails({
        name: "",
        age: "",
        bow: "",
        district: "",
        sex: "",
        scores: { d11: "", d12: "", d13: "" },
      });
    }
  }, [selectedPlayerId]);

  // Handle changes to score inputs
  const handleScoreChange = useCallback(
    (field) => (event) => {
      const newScore = event.target.value;
      setPlayerDetails((prevDetails) => ({
        ...prevDetails,
        scores: {
          ...prevDetails.scores,
          [field]: newScore,
        },
      }));
    },
    []
  );

  // Update Firebase when scores change
  useEffect(() => {
    if (selectedPlayerId) {
      const playerRef = ref(db, `${DATA_PATH}/${selectedPlayerId}`);
      update(playerRef, {
        d11: playerDetails.scores.d11,
        d12: playerDetails.scores.d12,
        d13: playerDetails.scores.d13,
      })
        .then(() => console.log("Updated scores in Firebase"))
        .catch((error) => console.error("Error updating scores:", error));
    }
  }, [playerDetails.scores, selectedPlayerId]);

  // Calculate the sum of the scores
  const calculateSum = () => {
    const d11 = parseFloat(playerDetails.scores.d11) || 0;
    const d12 = parseFloat(playerDetails.scores.d12) || 0;
    const d13 = parseFloat(playerDetails.scores.d13) || 0;
    return d11 + d12 + d13;
  };

  // Handle board selection change
  const handleChange = useCallback((event) => {
    const selectedValue = event.target.value;
    const boardNumber = Number(selectedValue.replace("board-", ""));
    setSelectedBoard(boardNumber);
  }, []);

  // Handle player radio button change
  const handleradioChange = useCallback((event) => {
    const playerId = event.target.value;
    setSelectedPlayerId(playerId);
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
              <React.Fragment key={player.id}>
                <input
                  className="radio"
                  id={`radio-${player.id}`}
                  type="radio"
                  name="group"
                  value={player.id}
                  checked={selectedPlayerId === player.id}
                  onChange={handleradioChange}
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
                <input
                  type="number"
                  id="d11"
                  value={playerDetails.scores.d11 || ""}
                  onChange={handleScoreChange("d11")}
                />
              </div>
              <div className="c-2">
                <input
                  type="number"
                  id="d12"
                  value={playerDetails.scores.d12 || ""}
                  onChange={handleScoreChange("d12")}
                />
              </div>
              <div className="c-3">
                <input
                  type="number"
                  id="d13"
                  value={playerDetails.scores.d13 || ""}
                  onChange={handleScoreChange("d13")}
                />
              </div>
              <div className="c-sum">
                <div className="_text">
                  <label id="s1">{calculateSum()}</label>
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

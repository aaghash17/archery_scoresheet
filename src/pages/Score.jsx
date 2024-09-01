import { useState, useEffect, useCallback } from "react";
import EventName from "../components/Score/EventName";
import PlayerSelector from "../components/Score/PlayerSelector";
import { ref, onValue, update } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";
import "../css/Scoredatastyle.css";
import "../css/Scoretable.css";

function Score() {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [playerDetails, setPlayerDetails] = useState({
    name: "",
    age: "",
    bow: "",
    district: "",
    sex: "",
    scores: { d11: "", d12: "", d13: "" },
  });

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

  return (
    <div className="mobile">
      <EventName />
      <PlayerSelector
        onBoardChange={() => {
          // Optional: handle board change if needed
        }}
        onPlayerSelect={(playerId) => setSelectedPlayerId(playerId)}
      />
      <div className="wrapper">
        {playerDetails.name && (
          <div>
            <div className="person-details">
              <div className="person-details-text">
                <br />
                <label id="pname">{playerDetails.name}</label>
                <br />
                <label id="district">{playerDetails.district}</label>
                <br />
                <label id="age">{playerDetails.age}</label>
                <br />
                <label id="sex">{playerDetails.sex}</label>
                <br />
                <label id="bow">{playerDetails.bow}</label>
                <br />
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
          <div className="table-total">
            <div className="frame-18">
              <div className="_text">Total</div>
            </div>
            <div className="frame-19">
              <div className="_text">
                <label id="total"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Score;

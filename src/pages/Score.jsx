import { useState, useEffect, useCallback } from "react";
import EventName from "../components/Score/EventName";
import PlayerSelector from "../components/Score/PlayerSelector";
import PlayerDetails from "../components/Score/PlayerDetails";
import ScoreTable from "../components/Score/ScoreTable"; // Import the new ScoreTable component
import { ref, onValue, update } from "firebase/database";
import { db, DATA_PATH } from "../firebase/firebaseConfig";
import "../css/Scoredatastyle.css";

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

  useEffect(() => {
    if (selectedPlayerId) {
      const playerRef = ref(db, `${DATA_PATH}/${selectedPlayerId}`);
      update(playerRef, playerDetails.scores)
        .then(() => console.log("Updated scores in Firebase"))
        .catch((error) => console.error("Error updating scores:", error));
    }
  }, [playerDetails.scores, selectedPlayerId]);

  return (
    <div className="mobile">
      <EventName />
      <PlayerSelector
        onBoardChange={() => {
          // Optional: handle board change if needed
        }}
        onPlayerSelect={(playerId) => setSelectedPlayerId(playerId)}
      />
      <PlayerDetails playerDetails={playerDetails} />
      <ScoreTable
        scores={playerDetails.scores}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
}

export default Score;

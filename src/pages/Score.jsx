import { useState, useEffect } from "react";
import EventName from "../components/Score/EventName";
import PlayerSelector from "../components/Score/PlayerSelector";
import PlayerDetails from "../components/Score/PlayerDetails";
import ScoreTable from "../components/Score/ScoreTable";
import { subscribeToScoreData } from "../firebase/firebaseService";
import "../css/Scoredatastyle.css";

function Score() {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [scoreData, setScoreData] = useState("");

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToScoreData((scoreData) => {
      setScoreData(scoreData ?? ""); // Display the event name or empty string
    });

    // Cleanup the listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="mobile">
      <EventName />
      <PlayerSelector
        scoreData={scoreData}
        onBoardChange={() => {
          setSelectedPlayerId("");
        }}
        onPlayerSelect={(playerId) => setSelectedPlayerId(playerId)}
      />
      {selectedPlayerId && (
        <PlayerDetails playerData={scoreData[selectedPlayerId]} />
      )}
      {selectedPlayerId && (
        <ScoreTable
          scoreData={scoreData[selectedPlayerId]}
          selectedPlayerId={selectedPlayerId}
        />
      )}
    </div>
  );
}

export default Score;

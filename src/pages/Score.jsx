import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventName from "../components/Score/EventName";
import PlayerSelector from "../components/Score/PlayerSelector";
import PlayerDetails from "../components/Score/PlayerDetails";
import ScoreTable from "../components/Score/ScoreTable";
import {
  subscribeToScoreData,
  getAccessData,
} from "../firebase/firebaseService";
import "../css/Scoredatastyle.css";
import { SyncLoader } from "react-spinners";

function Score() {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessGuid } = useParams();
  const [accessData, setAccessData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessData = await getAccessData(accessGuid);
        if (accessData) {
          setAccessData(accessData);
          const unsubscribe = subscribeToScoreData(
            (data) => {
              setScoreData(data ?? {});
              setLoading(false);
            },
            (err) => {
              setError(err);
              setLoading(false);
            }
          );

          return () => {
            if (unsubscribe) {
              unsubscribe();
            }
          };
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [accessGuid]);

  return (
    <div className="mobile">
      {loading ? (
        <div className="centered-container d-flex justify-content-center align-items-center">
          <SyncLoader />
        </div>
      ) : error ? (
        <p>Error loading score data: {error.message}</p>
      ) : (
        <>
          <br />
          <div className="header">
            <h2>
              <EventName />
            </h2>
          </div>
          <div className="text-center">
            <p>
              &lt;{"boardNumber:" + accessData.boardNumber || "No access"}&gt;
            </p>
          </div>
          <PlayerSelector
            scoreData={scoreData}
            accessBoard={
              accessData.boardNumber !== undefined
                ? accessData.boardNumber
                : null
            }
            onBoardChange={() => setSelectedPlayerId("")}
            onPlayerSelect={(playerId) => setSelectedPlayerId(playerId)}
          />
          {selectedPlayerId && (
            <>
              <PlayerDetails playerData={scoreData[selectedPlayerId]} />
              <ScoreTable
                scoreData={scoreData[selectedPlayerId]}
                selectedPlayerId={selectedPlayerId}
                accessBoard={
                  accessData.boardNumber !== undefined
                    ? accessData.boardNumber
                    : null
                }
              />
            </>
          )}
          <br />
        </>
      )}
    </div>
  );
}

export default Score;

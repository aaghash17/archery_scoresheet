import { useState, useCallback, useEffect } from "react";
import {
  getScoreData,
  getAccessData,
  updateAccessData,
} from "../../firebase/firebaseService";

function generateGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function Access() {
  const [boardsWithGUID, setBoardsWithGUID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = `${window.location.protocol}//${window.location.host}`;

  useEffect(() => {
    const fetchAccessData = async () => {
      setLoading(true);
      try {
        const accessData = await getAccessData();
        if (accessData) {
          const formattedData = Object.entries(accessData)
            .map(([guid, { boardNumber }]) => ({ guid, boardNumber }))
            .sort((a, b) => a.boardNumber - b.boardNumber);
          setBoardsWithGUID(formattedData);
        } else {
          setError("No access data found.");
        }
      } catch (err) {
        console.error("Error fetching access data:", err);
        setError("Failed to fetch access data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessData();
  }, []);

  const handleAccessGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const scoreData = await getScoreData();
      if (!scoreData) throw new Error("No score data found.");

      const boardNumbers = Array.from(
        new Set(Object.values(scoreData).map((item) => Number(item.tboard)))
      );

      if (boardNumbers.length > 0) {
        boardNumbers.unshift(0);
      }

      const uniqueGUIDs = new Set();
      const boardsWithGUIDs = boardNumbers.map((board) => {
        let guid;
        do {
          guid = generateGUID();
        } while (uniqueGUIDs.has(guid));
        uniqueGUIDs.add(guid);
        return { boardNumber: board, guid };
      });

      await updateAccessData(boardsWithGUIDs);
      setBoardsWithGUID(
        boardsWithGUIDs.sort((a, b) => a.boardNumber - b.boardNumber)
      );
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate access data. " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="container mt-4">
      <h4>Access Manage</h4>
      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={handleAccessGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Access"}
        </button>
      </div>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {boardsWithGUID.length === 0 && !loading && (
        <div>No boards available.</div>
      )}
      {boardsWithGUID.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Board Number</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {boardsWithGUID.map(({ boardNumber, guid }) => (
              <tr key={guid}>
                <td>{boardNumber}</td>
                <td>
                  <a
                    href={`${BASE_URL}/archery_scoresheet/#/score/${guid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${BASE_URL}/archery_scoresheet/#/score/${guid}`}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Access;

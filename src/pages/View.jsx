import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useState } from "react";
import {
  subscribeToScoreData,
  subscribeToViewTableData,
} from "../firebase/firebaseService";
import EventName from "../components/Score/EventName";
import "../css/viewStyles.css";
import { PacmanLoader } from "react-spinners";

function View() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayLength, setDisplayLength] = useState(10);
  const [displayTime, setDisplayTime] = useState(5000); // time in milliseconds

  useEffect(() => {
    const unsubscribeScore = subscribeToScoreData(
      (scoreData) => {
        if (scoreData) {
          const scoreArray = Object.values(scoreData);
          setData(scoreArray);
        } else {
          setData([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching score data:", error);
        setData([]);
        setLoading(false);
        setError("Failed to get score data.");
      }
    );

    const unsubscribeViewData = subscribeToViewTableData((newData) => {
      setDisplayLength(newData.length || 10); // Default to 10 if no data
      setDisplayTime(newData.time * 1000 || 5000); // Default to 5000 ms if no data
    });

    return () => {
      unsubscribeScore && unsubscribeScore();
      unsubscribeViewData && unsubscribeViewData();
    };
  }, []);

  const sortedData = [...data].sort((a, b) => (b.total || 0) - (a.total || 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) % Math.ceil(sortedData.length / displayLength)
      );
    }, displayTime);

    return () => clearInterval(interval);
  }, [sortedData.length, displayLength, displayTime]);

  const scoresToDisplay = sortedData.slice(
    currentIndex * displayLength,
    currentIndex * displayLength + displayLength
  );

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-dark bg-primary rounded py-4">
        <div className="container text-center">
          <br />
          <span className="navbar-brand mb-0 h1" style={{ fontSize: "2rem" }}>
            <EventName />
            <br />
            SCORESHEET
          </span>
          <br />
        </div>
      </nav>
      <br />
      <div className="container">
        {loading ? (
          <div className="d-flex justify-content-center">
            <PacmanLoader color="#0d6efd" />
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th scope="col">TARGET</th>
                <th scope="col">NAME</th>
                <th scope="col">DISTRICT</th>
                <th scope="col">AGE</th>
                <th scope="col">BOW</th>
                <th scope="col">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {scoresToDisplay.length > 0 ? (
                scoresToDisplay.map(
                  (
                    { tboard, tplayer, name, district, age, bow, total },
                    index
                  ) => (
                    <tr
                      key={`${name}-${index}`}
                      className={`score-row ${index === 0 ? "slide-up" : ""}`}
                    >
                      <td>{`${tboard} - ${tplayer}`}</td>
                      <td>{name}</td>
                      <td>{district}</td>
                      <td>{age}</td>
                      <td>{bow}</td>
                      <td>{total !== undefined ? total : 0}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No score data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default View;

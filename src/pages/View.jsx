import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useState } from "react";
import { subscribeToScoreData } from "../firebase/firebaseService";
import EventName from "../components/Score/EventName";
import "../css/viewStyles.css"; // Import the scoped CSS file

function View() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToScoreData(
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
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const sortedData = [...data].sort((a, b) => (b.total || 0) - (a.total || 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % Math.ceil(sortedData.length / 10)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [sortedData.length]);

  const scoresToDisplay = sortedData.slice(
    currentIndex * 10,
    currentIndex * 10 + 10
  );

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-dark bg-primary rounded py-4">
        <div className="container text-center">
          <br />
          <span className="navbar-brand mb-0 h1" style={{ fontSize: "2rem" }}>
            <EventName />
            <br />
            <br />
            SCORESHEET
          </span>
          <br />
        </div>
      </nav>
      <div className="pt-5"></div>
      <div className="px-5"></div>

      <div className="container">
        {loading ? (
          <div className="text-center">Loading scores...</div>
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
                  <td colSpan="7" className="text-center">
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

import { useState } from "react";
import EventNameScore from "../components/EventNameScore";
import "../css/Scoredatastyle.css";
import "../css/Scoretable.css";

function Score() {
  const [selectedBoard, setSelectedBoard] = useState("none");

  const handleChange = (event) => {
    setSelectedBoard(event.target.value);
  };

  return (
    <div className="mobile">
      <EventNameScore />
      <div className="custom-select">
        <select value={selectedBoard} onChange={handleChange}>
          <option value="none" disabled hidden>
            Select a board
          </option>
          {[...Array(10)].map((_, index) => (
            <option key={index} value={`board-${index + 1}`}>
              Board-{index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Score;

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  handleScoreEdit,
  subscribeToNoofEnds,
} from "../../firebase/firebaseService";
import RowData from "./RowData";
import "../../css/Scoretable.css";

function checkValueToWrite({ value }) {
  if (
    value === "X" ||
    value === "M" ||
    (typeof value === "string" &&
      !isNaN(value) &&
      Number(value) >= 0 &&
      Number(value) <= 10)
  ) {
    return true;
  }
  return false;
}

function ScoreTable({ scoreData, selectedPlayerId }) {
  const [noOfEnds, setNoOfEnds] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToNoofEnds((newNoOfEnds) => {
      setNoOfEnds(newNoOfEnds || ""); // Update state with the latest no of ends
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleChange = (field, event) => {
    if (checkValueToWrite({ value: event.target.value })) {
      handleScoreEdit(selectedPlayerId, field, event.target.value);
    }
  };

  return (
    <div className="table-scoresheet">
      <div className="table-heading1">
        <div className="table-heading1-frame-1">
          <div className="_text">S.No</div>
        </div>
        <div className="table-heading1-frame-2">
          <div className="_text">Score</div>
        </div>
        <div className="table-heading1-frame-3">
          <div className="_text">Sum</div>
        </div>
      </div>
      <div className="table-heading2">
        <div className="table-heading2-frame-1">
          <div className="_text">1</div>
        </div>
        <div className="table-heading2-frame-1">
          <div className="_text">2</div>
        </div>
        <div className="table-heading2-frame-1">
          <div className="_text">3</div>
        </div>
      </div>
      <div>
        {Array.from({ length: noOfEnds }).map((_, index) => (
          <RowData
            key={index + 1}
            index={index + 1}
            scoreData={scoreData}
            handleChange={handleChange}
          />
        ))}
      </div>
      <div className="table-total">
        <div className="table-total-frame-1">
          <div className="_text">Total</div>
        </div>
        <div className="table-total-frame-2">
          <div className="_text">
            <label id="total">To-do-Total</label>
          </div>
        </div>
      </div>
    </div>
  );
}

ScoreTable.propTypes = {
  scoreData: PropTypes.shape({
    d11: PropTypes.string,
    d12: PropTypes.string,
    d13: PropTypes.string,
  }).isRequired,
  selectedPlayerId: PropTypes.string.isRequired,
};

export default ScoreTable;

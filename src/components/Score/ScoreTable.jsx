import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  getScoreData,
  handleScoreEdit,
  subscribeToNoofEnds,
} from "../../firebase/firebaseService";
import RowData from "./RowData";
import "../../css/Scoretable.css";

const isValidScoreValue = (value) => {
  return (
    value === "X" ||
    value === "M" ||
    (typeof value === "string" &&
      !isNaN(value) &&
      Number(value) >= 0 &&
      Number(value) <= 10)
  );
};

const calculateTotalSum = (scoreData, noOfEnds) => {
  return Array.from({ length: noOfEnds }).reduce((acc, _, index) => {
    const fieldset = [`d${index + 1}1`, `d${index + 1}2`, `d${index + 1}3`];
    const rowSum = fieldset.reduce((sum, field) => {
      const value = scoreData[field];
      if (value === undefined) return sum; // Skip undefined values
      if (value === "X") return sum + 10;
      if (value === "M") return sum;
      const numValue = parseFloat(value);
      return isNaN(numValue) ? sum : sum + numValue;
    }, 0);
    return acc + rowSum;
  }, 0);
};

function ScoreTable({ scoreData, selectedPlayerId, accessBoard }) {
  const [noOfEnds, setNoOfEnds] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToNoofEnds(setNoOfEnds);
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleChange = useCallback(
    async (field, event) => {
      const newValue = event.target.value;
      if (isValidScoreValue(newValue)) {
        await handleScoreEdit(selectedPlayerId, field, newValue);
        const newScoreData = await getScoreData(selectedPlayerId); // Pass playerId to get specific data
        const totalSum = calculateTotalSum(newScoreData, noOfEnds); // Calculate total sum
        await handleScoreEdit(selectedPlayerId, "total", totalSum); // Update total in the database
      }
    },
    [selectedPlayerId, noOfEnds]
  );

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
        {[1, 2, 3].map((num) => (
          <div className="table-heading2-frame-1" key={num}>
            <div className="_text">{num}</div>
          </div>
        ))}
      </div>
      <div>
        {Array.from({ length: noOfEnds }).map((_, index) => (
          <RowData
            key={index + 1}
            index={index + 1}
            accessBoard={accessBoard}
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
          <div className="_text">{scoreData["total"]}</div>
        </div>
      </div>
    </div>
  );
}

ScoreTable.propTypes = {
  scoreData: PropTypes.shape({
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  accessBoard: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]).isRequired,
  selectedPlayerId: PropTypes.string.isRequired,
};

export default ScoreTable;

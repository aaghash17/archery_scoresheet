import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { ref, update } from "firebase/database";
import { db, SCORE_PATH } from "../../firebase/firebaseConfig";
import "../../css/Scoretable.css";

function ScoreTable({ scoreData, selectedPlayerId }) {
  const [error, setError] = useState(null);

  const handleEdit = (id, field, value) => {
    const dataRef = ref(db, `${SCORE_PATH}/${selectedPlayerId}`);
    update(dataRef, { [field]: value })
      .then(() => console.log(`Updated ${field} for row ${id}`))
      .catch((error) => {
        setError("Error updating data: " + error.message);
        console.error("Error updating data:", error);
      });
  };

  const handleChange = (field, event) => {
    handleEdit(selectedPlayerId, field, event.target.value);
  };

  // Calculate the sum of the scores
  const calculateSum = useMemo(() => {
    const d11 = parseFloat(scoreData.d11) || 0;
    const d12 = parseFloat(scoreData.d12) || 0;
    const d13 = parseFloat(scoreData.d13) || 0;
    return d11 + d12 + d13;
  }, [scoreData]);

  // Calculate total sum (example with one row, extend this as needed)
  const calculateTotalSum = useMemo(() => {
    // Here we assume there's only one row, adapt if you have more
    return calculateSum; // Extend for multiple rows if needed
  }, [calculateSum]);

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
      <div className="row-data">
        <div className="c-sno">
          <div className="_text">1</div>
        </div>
        <div className="c-1">
          <input
            type="number"
            value={scoreData["d11"] || ""}
            onChange={(e) => handleChange("d11", e)}
          />
        </div>
        <div className="c-2">
          <input
            type="number"
            value={scoreData["d12"] || ""}
            onChange={(e) => handleChange("d12", e)}
          />
        </div>
        <div className="c-3">
          <input
            type="number"
            value={scoreData["d13"] || ""}
            onChange={(e) => handleChange("d13", e)}
          />
        </div>
        <div className="c-sum">
          <div className="_text">
            <label id="s1">{calculateSum}</label>
          </div>
        </div>
      </div>
      {/* Example for a second row */}
      <div className="row-data">
        <div className="c-sno">
          <div className="_text">2</div>
        </div>
        <div className="c-1"></div>
        <div className="c-2"></div>
        <div className="c-3"></div>
        <div className="c-sum">
          <div className="_text"></div>
        </div>
      </div>
      <div className="table-total">
        <div className="table-total-frame-1">
          <div className="_text">Total</div>
        </div>
        <div className="table-total-frame-2">
          <div className="_text">
            <label id="total">{calculateTotalSum}</label>
          </div>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
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

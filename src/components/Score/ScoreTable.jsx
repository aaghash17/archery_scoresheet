import { useMemo } from "react";
import PropTypes from "prop-types";
import "../../css/Scoretable.css";

function ScoreTable({ scores, onScoreChange }) {
  // Calculate the sum of the scores
  const calculateSum1 = useMemo(() => {
    const d11 = parseFloat(scores.d11) || 0;
    const d12 = parseFloat(scores.d12) || 0;
    const d13 = parseFloat(scores.d13) || 0;
    return d11 + d12 + d13;
  }, [scores]);

  return (
    <div className="table-scoresheet">
      <div className="table-heading">
        <div className="table-heading1">
          <div className="frame-1">
            <div className="_text">S.No</div>
          </div>
          <div className="frame-2">
            <div className="_text">Score</div>
          </div>
          <div className="frame-3">
            <div className="_text">Sum</div>
          </div>
        </div>
        <div className="table-heading2">
          <div className="frame-4">
            <div className="_text">1</div>
          </div>
          <div className="frame-4">
            <div className="_text">2</div>
          </div>
          <div className="frame-4">
            <div className="_text">3</div>
          </div>
        </div>
        <div className="table-data">
          <div className="row-1">
            <div className="c-sno">
              <div className="_text">1</div>
            </div>
            <div className="c-1">
              <input
                type="number"
                id="d11"
                value={scores.d11 || ""}
                onChange={onScoreChange("d11")}
              />
            </div>
            <div className="c-2">
              <input
                type="number"
                id="d12"
                value={scores.d12 || ""}
                onChange={onScoreChange("d12")}
              />
            </div>
            <div className="c-3">
              <input
                type="number"
                id="d13"
                value={scores.d13 || ""}
                onChange={onScoreChange("d13")}
              />
            </div>
            <div className="c-sum">
              <div className="_text">
                <label id="s1">{calculateSum1}</label>
              </div>
            </div>
          </div>
          <div className="row-2">
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
          <div className="row-3">
            <div className="c-sno">
              <div className="_text">3</div>
            </div>
            <div className="c-1"></div>
            <div className="c-2"></div>
            <div className="c-3"></div>
            <div className="c-sum">
              <div className="_text"></div>
            </div>
          </div>
        </div>
        <div className="table-total">
          <div className="frame-18">
            <div className="_text">Total</div>
          </div>
          <div className="frame-19">
            <div className="_text">
              <label id="total"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ScoreTable.propTypes = {
  scores: PropTypes.shape({
    d11: PropTypes.string,
    d12: PropTypes.string,
    d13: PropTypes.string,
  }).isRequired,
  onScoreChange: PropTypes.func.isRequired,
};

export default ScoreTable;

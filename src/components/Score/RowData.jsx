import PropTypes from "prop-types";
import { useMemo } from "react";

// Component to render an individual input cell
const InputCell = ({ field, value, onChange }) => (
  <div className={`c-${field.slice(-1)}`}>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(field, e)}
    />
  </div>
);

// Define prop types for InputCell
InputCell.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// Component to render the sum cell
const SumCell = ({ sum }) => (
  <div className="c-sum">
    <div className="_text">{sum !== null ? sum : ""}</div>
  </div>
);

// Define prop types for SumCell
SumCell.propTypes = {
  sum: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

// Main RowData component
const RowData = ({ index, scoreData, handleChange }) => {
  // Memoize fieldset to avoid recalculating on every render
  const fieldset = useMemo(
    () => [`d${index}1`, `d${index}2`, `d${index}3`],
    [index]
  );

  // Calculate sum of the fields
  const calculateSum = useMemo(() => {
    const calculateFieldSum = (sum, field) => {
      const value = scoreData[field];
      let score;

      // Determine the score based on the value
      if (value === "X") {
        score = 10;
      } else if (value === "M") {
        score = 0;
      } else if (value === "" || value === null) {
        score = null; // Treat empty strings as null
      } else {
        score = parseFloat(value);
        score = isNaN(score) ? null : score; // Use null for NaN
      }

      // If score is valid (not null), add it to the sum
      return score !== null ? sum + score : sum;
    };

    const totalSum = fieldset.reduce(calculateFieldSum, 0);

    // Check if there were any valid scores
    const hasValidScore = fieldset.some((field) => {
      const value = scoreData[field];
      return (
        value === "X" ||
        value === "M" ||
        (typeof value === "string" && !isNaN(value) && value !== "")
      );
    });

    return hasValidScore ? totalSum : ""; // Return total sum if valid scores exist, else null
  }, [fieldset, scoreData]);

  return (
    <div className="row-data">
      <div className="c-sno">
        <div className="_text">{index}</div>
      </div>
      {fieldset.map((field) => (
        <InputCell
          key={field}
          field={field}
          value={scoreData[field]}
          onChange={handleChange}
        />
      ))}
      <SumCell sum={calculateSum !== "" ? calculateSum.toString() : ""} />
    </div>
  );
};

// Define prop types for RowData
RowData.propTypes = {
  index: PropTypes.number.isRequired,
  scoreData: PropTypes.objectOf(PropTypes.string).isRequired, // Changed to objectOf(PropTypes.string)
  handleChange: PropTypes.func.isRequired,
};

export default RowData;

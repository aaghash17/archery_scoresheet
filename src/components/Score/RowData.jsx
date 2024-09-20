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
  const fieldset = useMemo(
    () => [`d${index}1`, `d${index}2`, `d${index}3`],
    [index]
  );

  // Calculate sum of the fields
  const calculateSum = useMemo(() => {
    const totalSum = fieldset.reduce((sum, field) => {
      const value = scoreData[field];
      if (value === "X") return sum + 10;
      if (value === "M") return sum + 0;
      if (value === "" || value === null) return sum;
      const numValue = parseFloat(value);
      return isNaN(numValue) ? sum : sum + numValue;
    }, 0);

    return totalSum > 0 ? totalSum : ""; // Return an empty string if the sum is 0
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

RowData.propTypes = {
  index: PropTypes.number.isRequired,
  scoreData: PropTypes.objectOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default RowData;

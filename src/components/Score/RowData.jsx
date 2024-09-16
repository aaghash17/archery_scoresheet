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
    <div className="_text">{sum}</div>
  </div>
);

// Define prop types for SumCell
SumCell.propTypes = {
  sum: PropTypes.number.isRequired,
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
    return fieldset.reduce(
      (sum, field) => sum + (parseFloat(scoreData[field]) || 0),
      0
    );
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
      <SumCell sum={calculateSum} />
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

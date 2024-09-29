import PropTypes from "prop-types";
import { useMemo } from "react";

const InputCell = ({ field, value, onChange, accessBoard }) => {
  const isDisabled =
    accessBoard === null ||
    (typeof accessBoard === "number" && accessBoard !== 0 && value);

  return (
    <div className={`c-${field.slice(-1)}`}>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(field, e)}
        disabled={isDisabled}
        aria-label={`Input for ${field}`}
      />
    </div>
  );
};

InputCell.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  accessBoard: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]),
};

const SumCell = ({ sum }) => (
  <div className="c-sum">
    <div className="_text">{sum !== null ? sum : ""}</div>
  </div>
);

SumCell.propTypes = {
  sum: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const RowData = ({ index, accessBoard, scoreData, handleChange }) => {
  const fieldset = useMemo(
    () => [`d${index}1`, `d${index}2`, `d${index}3`],
    [index]
  );

  const calculateSum = useMemo(() => {
    const totalSum = fieldset.reduce((sum, field) => {
      const value = scoreData[field];
      if (value === "X") return sum + 10;
      if (value === "M") return sum + 0;
      if (value === "" || value === null) return sum;
      const numValue = parseFloat(value);
      return isNaN(numValue) ? sum : sum + numValue;
    }, 0);

    return totalSum > 0 ? totalSum : "";
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
          accessBoard={accessBoard}
        />
      ))}
      <SumCell sum={calculateSum !== "" ? calculateSum.toString() : ""} />
    </div>
  );
};

RowData.propTypes = {
  index: PropTypes.number.isRequired,
  accessBoard: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]).isRequired,
  scoreData: PropTypes.shape({
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default RowData;

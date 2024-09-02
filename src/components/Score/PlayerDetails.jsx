import PropTypes from "prop-types"; // Import PropTypes

const PlayerDetails = ({ playerDetails }) => {
  if (!playerDetails.name) return null;

  return (
    <div className="wrapper">
      <div className="person-details">
        <div className="person-details-text">
          <br />
          <label id="pname">{playerDetails.name}</label>
          <br />
          <label id="district">{playerDetails.district}</label>
          <br />
          <label id="age">{playerDetails.age}</label>
          <br />
          <label id="sex">{playerDetails.sex}</label>
          <br />
          <label id="bow">{playerDetails.bow}</label>
          <br />
        </div>
      </div>
    </div>
  );
};

// Define the expected prop types for this component
PlayerDetails.propTypes = {
  playerDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    bow: PropTypes.string.isRequired,
    district: PropTypes.string.isRequired,
    sex: PropTypes.string.isRequired,
  }).isRequired,
};

export default PlayerDetails;

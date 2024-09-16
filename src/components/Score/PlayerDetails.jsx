import PropTypes from "prop-types"; // Import PropTypes

const PlayerDetails = ({ playerData }) => {
  if (!playerData) return null;

  return (
    <div className="wrapper">
      <div className="person-details">
        <div className="person-details-text">
          <br />
          <label id="pname">{playerData.name}</label>
          <br />
          <label id="district">{playerData.district}</label>
          <br />
          <label id="age">{playerData.age}</label>
          <br />
          <label id="sex">{playerData.sex}</label>
          <br />
          <label id="bow">{playerData.bow}</label>
          <br />
        </div>
      </div>
    </div>
  );
};

// Define prop types
PlayerDetails.propTypes = {
  playerData: PropTypes.shape({
    name: PropTypes.string,
    district: PropTypes.string,
    age: PropTypes.string,
    sex: PropTypes.string,
    bow: PropTypes.string,
  }),
};

export default PlayerDetails;

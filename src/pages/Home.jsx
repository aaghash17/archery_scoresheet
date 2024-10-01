import "bootstrap/dist/css/bootstrap.min.css";
import "../css/HomePage.css"; // Ensure this path is correct
import logo from "../assets/title.ico";

const HomePage = () => {
  return (
    <div className="background-image d-flex flex-column justify-content-between align-items-center vh-100 position-relative">
      <div className="overlay"></div>
      <div className="content text-center flex-grow-1 d-flex justify-content-center align-items-center">
        <div>
          <h1 className="mb-4 text-white">Welcome to Our Website!</h1>
          <img
            src={logo} // Update with your logo file name
            alt="Logo"
            className="mb-4 img-fluid"
            style={{ maxWidth: "150px" }}
          />
          <div>
            <a
              href="/archery_scoresheet/#/view"
              className="btn btn-primary mx-2"
            >
              View Table
            </a>
            <a
              href="/archery_scoresheet/#/score"
              className="btn btn-secondary mx-2"
            >
              Score Table
            </a>
          </div>
        </div>
      </div>
      <footer className="text-center text-white mb-4">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

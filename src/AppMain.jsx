import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Test from "./test";

function AppMain() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Test" element={<Test />} />
        </Routes>
      </Router>
    </div>
  );
}

export default AppMain;

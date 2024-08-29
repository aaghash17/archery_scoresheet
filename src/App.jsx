import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Or use BrowserRouter here
import Admin from "./pages/Admin";
import Score from "./pages/Score";

function App() {
  return (
    <Router>
      <Routes>
        {/* For Test */}
        <Route path="/" element={<Admin />} />
        {/* For Dev */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/score" element={<Score />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Or use BrowserRouter here
import Admin from "./pages/Admin";
import Score from "./pages/Score";
import Page404 from "./pages/Page404";
import View from "./pages/View";
function App() {
  return (
    <Router>
      <Routes>
        {/* For Test */}
        <Route path="/" element={<Admin />} />
        {/* For Dev */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/score/:access?" element={<Score />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/view" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App;

import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Or use BrowserRouter here
import Admin from "./pages/Admin";
import Score from "./pages/Score";
import Page404 from "./pages/Page404";
import View from "./pages/View";
import HomePage from "./pages/Home";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/score/:accessGuid?" element={<Score />} />
        <Route path="/view" element={<View />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;

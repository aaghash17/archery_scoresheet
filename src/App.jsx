import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Or use BrowserRouter here
import VitePage from "./pages/VitePage";
import Test from "./pages/Test";
import Admin from "./pages/Admin";
import Datatable from "./pages/Datatable";

function App() {
  return (
    <Router>
      <Routes>
        {/* For Test */}
        <Route path="/" element={<VitePage />} />
        <Route path="/test" element={<Test />} />
        {/* For Dev */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/table" element={<Datatable />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

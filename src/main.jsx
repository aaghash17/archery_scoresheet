import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import App from './App.jsx'
import AppMain from "./AppMain.jsx";
//import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppMain />
  </StrictMode>
);

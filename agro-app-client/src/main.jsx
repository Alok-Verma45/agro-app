import React from "react";
import ReactDOM from "react-dom/client";  // ✅ IMPORTANT
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // ✅ Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
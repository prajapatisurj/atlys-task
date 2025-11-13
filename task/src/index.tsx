import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error(
    "Root element not found — ensure there's an element with id='root' in index.html"
  );
}

const root = createRoot(rootEl); 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./Components/App";

import "./index.css";
import "./i18n";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
} else console.log("Something went wrong in index.tsx rendering");

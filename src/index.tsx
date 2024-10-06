import { createRoot } from "react-dom/client";
import App from "./Components/App";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else console.log("Something went wrong in index.tsx rendering");

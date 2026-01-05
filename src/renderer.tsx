import "./index.css";

import { createRoot } from "react-dom/client";
import Home from "./pages/home";

const App = () => {
  return <Home />;
};

const container = document.getElementById("root");
if (container) {
  // Safety check
  const root = createRoot(container);
  root.render(<App />);
}

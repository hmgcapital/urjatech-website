
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useEffect } from "react";
import { Router, useLocation } from "wouter";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <Router>
    <ScrollToTop />
    <App />
  </Router>
);

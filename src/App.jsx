import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import PageLayout from "./views/Layout";
import Home from "./views/Home";
import About from "./views/About";
import NotFound from "./views/NotFound";
import BookDetailsLocation from "./views/BookDetailsLocation";
import BookDetailsParams from "./views/BookDetailsParams";
import { useEffect } from "react";

const OnlineStatusHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => {
      if (document.getElementById("offline-indicator")) {
        document.getElementById("offline-indicator").style.display = "none";
      }
    };

    const handleOffline = () => {
      let indicator = document.getElementById("offline-indicator");

      if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "offline-indicator";
        indicator.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 10px 15px;
          background: #ff4d4f;
          color: white;
          border-radius: 4px;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        `;
        indicator.textContent = "You're offline - working in offline mode";
        document.body.appendChild(indicator);
      } else {
        indicator.style.display = "block";
      }
    };

    if (!navigator.online) handleOffline();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [location]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <OnlineStatusHandler />
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/book-details-location"
            element={<BookDetailsLocation />}
          />
          <Route
            path="/book-details-params/:id"
            element={<BookDetailsParams />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PageLayout from "./views/Layout";
import Home from "./views/Home";
import About from "./views/About";
import NotFound from "./views/NotFound";
import BookDetailsLocation from "./views/BookDetailsLocation";
import BookDetailsParams from "./views/BookDetailsParams";
import { useEffect, useState } from "react";

const OnlineStatusHandler = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Event listeners for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    isOffline && (
      <div
        id="offline-indicator"
        className="fixed font-sans bottom-5 right-5 px-[15px] py-[10px] bg-[#ff4d4f] text-white rounded z-[1000] shadow-sm "
      >
        You're offline - Some featueres may not be
        available.
      </div>
    )
  );
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

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PageLayout from "./views/Layout";
import Home from "./views/Home";
import About from "./views/About";
import NotFound from "./views/NotFound";
import BookDetailsLocation from "./views/BookDetailsLocation";
import BookDetailsParams from "./views/BookDetailsParams";

function App() {
  return (
    <BrowserRouter>
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

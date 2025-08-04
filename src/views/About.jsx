import React from "react";
import { useTheme } from "../context/useTheme";

const About = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`${
        theme === "light" ? "light text-gray-800" : "dark text-gray-200"
      } p-6 max-w-3xl mx-auto`}
    >
      <h1 className="text-3xl font-semibold mb-4">About Book Tracker</h1>
      <p className="mb-4 text-lg leading-relaxed">
        <strong>Book Tracker</strong> is a simple web app that fetches and
        displays books from the Google Books API. You can search for books, add
        your own custom entries, and even switch between light and dark themes
        to suit your preference.
      </p>
      <p className="mb-4 text-lg leading-relaxed">
        This project is built using <span className="font-medium">React</span>,
        styled with <span className="font-medium">TailwindCSS</span>, and makes
        use of the <span className="font-medium">Ant Design</span> library for
        UI components.
      </p>
      <p className="text-lg leading-relaxed">
        Whether you're a book lover, developer, or just exploring, we hope this
        app brings you some inspiration—and maybe a good read!
      </p>
    </div>
  );
};

export default About;

import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`min-h-screen w-60 px-6 py-8 flex flex-col justify-between ${
        theme === "light"
          ? "bg-gray-100 text-gray-800"
          : "bg-gray-900 text-gray-200"
      }`}
    >
      <nav>
        <ul className="flex flex-col gap-4 text-lg font-medium">
          <li>
            <Link
              to="/"
              className="text-gray-800 dark:text-gray-300 dark:bg-gray-700 rounded text-lg font-medium transition-colors hover:text-gray-500 shadow-md hover:shadow-lg px-3 py-1"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="about"
              className="text-gray-800 dark:text-gray-300 dark:bg-gray-700 rounded text-lg font-medium transition-colors hover:text-gray-500 shadow-md hover:shadow-lg px-3 py-1"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>

      <button
        onClick={toggleTheme}
        title="Change Theme"
        className={`mt-10 w-full px-4 py-2 rounded-full text-sm font-semibold transition-colors 
          ${
            theme === "light"
              ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
      >
        <FontAwesomeIcon icon="fa-regular fa-moon" />
      </button>
    </aside>
  );
};

export default SideBar;

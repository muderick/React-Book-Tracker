import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TopBar = ({ styles }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`w-full flex justify-between items-center py-4 px-6 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      } border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
    >
      {/* Logo - Optional */}
      <div className="text-xl font-bold tracking-tight">
        <span
          className={`text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${
            isDark ? "from-gray-300 to-gray-500" : "from-gray-800 to-gray-600"
          }`}
        >
          BookApp
        </span>
      </div>

      <nav className="h-full flex items-center">
        <ul className="flex gap-4 h-full items-center mb-0">
          <li>
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center h-full ${
                isDark
                  ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center h-full ${
                isDark
                  ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              About
            </Link>
          </li>
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <button
            onClick={toggleTheme}
            className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-all duration-300 focus:outline-none ${
              isDark
                ? "bg-gradient-to-r from-gray-600 to-gray-800"
                : "bg-gradient-to-r from-gray-300 to-gray-400"
            }`}
            aria-label="Toggle theme"
          >
            <div
              className={`bg-white rounded-full shadow-sm w-4 h-4 transform transition-transform duration-300 ${
                isDark ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </button>
          <span
            className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded whitespace-nowrap z-50 group-hover:opacity-100 transition-opacity duration-300 ${
              isDark
                ? "bg-gray-800 text-gray-100 opacity-0"
                : "bg-gray-700 text-white opacity-0"
            }`}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

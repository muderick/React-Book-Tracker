import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TopBar = ({ styles }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="w-full flex justify-between items-center py-3 px-6">
      <nav className="pt-5">
        <ul className="flex gap-8 items-center" style={styles}>
          <li>
            <Link
              to="/"
              className="text-gray-800 dark:text-gray-300 dark:bg-[#1f2937] rounded text-lg font-medium transition-colors hover:text-gray-500 shadow-md hover:shadow-lg px-3 py-1"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="about"
              className="text-gray-800 dark:text-gray-300 dark:bg-[#1f2937] rounded text-lg font-medium transition-colors hover:text-gray-500 shadow-md hover:shadow-lg px-3 py-1"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>

      <div className="relative group inline-block">
        {theme === "light" ? (
          <FontAwesomeIcon
            onClick={toggleTheme}
            title="Change Theme"
            icon="fa-regular fa-moon"
            className="w-6 h-6 hover:cursor-pointer"
          />
        ) : (
          <FontAwesomeIcon
            onClick={toggleTheme}
            title="Change Theme"
            icon="fa-regular fa-sun"
            className="w-6 h-6 hover:cursor-pointer"
          />
        )}

        {/* Fixed tooltip */}
        <span
          className="
    absolute 
    top-[90%] 
    left-1/2 
    transform 
    -translate-x-1/2 
    -translate-y-1 
    px-2 
    py-1 
    text-xs 
    text-white 
    bg-black 
    rounded 
    opacity-0 
    group-hover:opacity-100 
    transition-opacity 
    duration-300 
    whitespace-nowrap
    z-50
    pointer-events-none
  "
        >
          Change Theme
          <span
            className="
      absolute 
      bottom-full 
      left-1/2 
      transform 
      -translate-x-[60%]
       rotate-180
      border-4 
      border-transparent 
      border-t-black
    "
          ></span>
        </span>
      </div>
    </div>
  );
};

export default TopBar;

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
          className={`  
                ${
                  theme === "light"
                    ? "bg-black text-white"
                    : "bg-gray-600 text-gray-100"
                }
                  absolute 
                  bottom-full
                  left-1/4 
                  transform 
                  -translate-x-1/2 
                  -translate-y-1 
                  px-2 
                  py-1 
                  text-xs 
                  text-white 
                  rounded 
                  opacity-0 
                  group-hover:opacity-100 
                  transition-opacity 
                  duration-300 
                  whitespace-nowrap
                  z-50
                  pointer-events-none
                  `}
        >
          Change Theme
          <span
            className="
                  absolute 
                  top-full 
                  left-[10px] 
                  transform 
                  -translate-x-[60%]
                  border-4 
                  border-transparent 
                  border-t-black
                  "
          ></span>
        </span>
      </div>
    </aside>
  );
};

export default SideBar;

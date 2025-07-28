import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomeIcon = () => (
  <FontAwesomeIcon icon="fa-regular fa-home" />
);

const InfoIcon = () => (
  <FontAwesomeIcon icon="fa-solid fa-info-circle" />
);

const SideBar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDark = theme === "dark";

  return (
    <aside
      className={`min-h-screen w-64 p-6 flex flex-col justify-between transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-200 border-r border-gray-700"
          : "bg-gray-50 text-gray-800 border-r border-gray-200"
      }`}
    >
      {/* Logo */}
      <div className="mb-10 pt-4">
        <h1
          className={`text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${
            isDark ? "from-gray-300 to-gray-500" : "from-gray-800 to-gray-600"
          }`}
        >
          Book App
        </h1>
      </div>

      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {[
            { path: "/", label: "Home", icon: HomeIcon },
            { path: "/about", label: "About", icon: InfoIcon },
          ].map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            const baseClasses =
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300";

            const activeStyle = isDark
              ? "bg-gradient-to-r from-gray-600/30 to-gray-800/30 text-gray-100 border-l-4 border-gray-400"
              : "bg-gradient-to-r from-gray-300/40 to-gray-200/40 text-gray-800 border-l-4 border-gray-400";

            const inactiveStyle = isDark
              ? "hover:bg-gray-700/50 text-gray-300"
              : "hover:bg-gray-100 text-gray-600";

            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`${baseClasses} ${
                    isActive ? activeStyle : inactiveStyle
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="mt-10">
        <div className="relative group">
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full flex items-center p-1 transition-all duration-300 ${
              isDark
                ? "bg-gradient-to-r from-gray-600 to-gray-800"
                : "bg-gradient-to-r from-gray-300 to-gray-400"
            }`}
          >
            <div
              className={`bg-white rounded-full shadow-md w-4 h-4 transform transition-transform duration-300 ${
                theme === "dark" ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
          <span
            className={`absolute left-14 top-1/2 transform -translate-y-1/2 text-sm px-2 py-1 rounded whitespace-nowrap z-50 group-hover:opacity-100 transition-opacity duration-300 ${
              isDark
                ? "bg-gray-800 text-gray-100 opacity-0"
                : "bg-gray-700 text-white opacity-0"
            }`}
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </span>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;

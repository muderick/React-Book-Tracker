import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem("theme");
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
  const [theme, setTheme] = useState(savedTheme || systemPreference);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

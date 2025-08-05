import { useTheme } from "../context/useTheme";

const FooterComponent = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`w-full px-6 py-4 text-center text-sm font-medium border-t ${
        theme === "light"
          ? "bg-gray-100 text-gray-700 border-gray-300"
          : "bg-gray-900 text-gray-400 border-gray-700"
      }`}
    >
      &copy; {new Date().getFullYear()} Book Tracker
    </footer>
  );
};

export default FooterComponent;

import { useTheme } from "../context/useTheme";
import BookTable from "../components/BookTable";

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className={`max-w-full mx-auto p-4 ${theme === "dark" ? "dark" : "light"}`}>
      <BookTable />
    </div>
  );
};

export default Home;

// import axios from "axios";

export const useDelete = (url) => {
  const deleteData = async (id) => {
    try {
      // await axios.delete(url);
      const existing = JSON.parse(localStorage.getItem("cachedbooks")) || [];
      const updatedBooks = existing.filter((book) => book.key !== id);
      localStorage.setItem("cachedbooks", JSON.stringify(updatedBooks));

      return true; // Indicate success
    } catch (error) {
      console.error(error);
      return false; // Indicate failure
    }
  };

  return { deleteData };
};

// import axios from "axios";

export const useUpdate = (url) => {
  const updateData = async (id, updates) => {
    try {
      // const res = await axios.put(url, updates);
      const existing = JSON.parse(localStorage.getItem("cachedbooks")) || [];
      const index = existing.findIndex((book) => book.key === id);

      if (index === -1) throw new Error("Book not found");

      const updatedBook = {
        ...existing[index],
        ...updates,
        thumbnail: updates.thumbnail || existing[index].thumbnail,
      };

      const updatedBooks = [...existing];
      updatedBooks[index] = updatedBook;

      localStorage.setItem("cachedbooks", JSON.stringify(updatedBooks));

      return updatedBook;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { updateData };
};

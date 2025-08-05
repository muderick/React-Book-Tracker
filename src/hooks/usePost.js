// import axios from "axios";

export const usePost = (url) => {
  const postData = async (newBook) => {
    try {
      // const res = await axios.post(url, newBook);
      const key = crypto.randomUUID();

      const bookToAdd = {
        key,
        title: newBook.title,
        authors: newBook.authors,
        thumbnail: "https://via.placeholder.com/80x120?text=Custom+Book",
      };

      const existing = JSON.parse(localStorage.getItem("cachedbooks")) || [];
      const updated = [...existing, bookToAdd];
      localStorage.setItem("cachedbooks", JSON.stringify(updated));

      return bookToAdd;
    } catch (error) {
      console.error(error);
    }
  };

  return { postData };
};

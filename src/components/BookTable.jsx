import { Button, Form, Image, message, Modal, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Input } from "antd";
import { useDelete } from "../hooks/useDelete";
import { useUpdate } from "../hooks/useUpdate";
import toast from "react-hot-toast";
import { usePost } from "../hooks/usePost";
import { useTheme } from "../context/useTheme";
import BookForm from "./BookForm";
import { Link, useNavigate } from "react-router-dom";
import ReusableButton from "./ReusableButton";
const { Search } = Input;

const LOCAL_STORAGE_KEY = "cachedbooks";

const BookTable = () => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const base_URL = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;
  const { data, loading } = useFetch(base_URL);
  const [books, setBooks] = useState(() => {
    try {
      const savedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedBooks ? JSON.parse(savedBooks) : [];
    } catch (error) {
      console.error("Failed to set books", error);
      return [];
    }
  });
  const { updateData } = useUpdate();
  const [editingId, setEditingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditingModal, setShowEditingmodal] = useState(false);
  const titleInput = useRef();
  const { postData } = usePost();
  const { deleteData } = useDelete(base_URL);
  const [filterText, setFilterText] = useState("");

  const filteredBooks = books.filter((book) => {
    const search = filterText.toLowerCase();
    return (
      book.title.toLowerCase().includes(search) ||
      book.authors.toLowerCase().includes(search)
    );
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const navigate = useNavigate();
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    if (!navigator.onLine) return;

    const fetchBooks = () => {
      if (data && data.items && data.items.length > 0) {
        const toHttps = (url) =>
          typeof url === "string" ? url.replace(/^http:\/\//, "https://") : url;

        const formattedBooks = data.items
          .filter((item) => item != null)
          .map((item) => {
            const volume = item.volumeInfo;
            let thumbnail =
              toHttps(volume.imageLinks?.thumbnail) ||
              "https://via.placeholder.com/80x120?text=No+Image";

            return {
              key: item.id,
              title: volume.title || "No Title",
              subtitle: volume.subtitle || "No Subtitle",
              thumbnail,
              industryIdentifiers: volume.industryIdentifiers,
              authors: volume.authors?.join(", ") || "Unknown",
              previewLink: toHttps(volume.previewLink),
              infoLink: toHttps(volume.infoLink),
              averageRating: volume.averageRating,
              ratingCount: volume.ratingCount,
              publisher: volume.publisher,
              publishedDate: volume.publishedDate,
              language: volume.language,
              pageCount: volume.pageCount,
              description: volume.description,
              categories: volume.categories,
            };
          });

        setBooks(formattedBooks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formattedBooks));
      }
    };

    fetchBooks();
  }, [data]);

  useEffect(() => {
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        // Show online notification
        message.success("You're back online! Books are now synced");

        // Sync local data
        const pendingUpdates =
          JSON.parse(localStorage.getItem("pendingUpdates")) || [];
        if (pendingUpdates.length > 0) {
          syncLocalDataToServer(pendingUpdates);
        }
      }
    };

    window.addEventListener("online", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      message.success("You're back online! Books are now synced");
      syncLocalDataToServer();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const syncLocalDataToServer = () => {
    const pendingUpdates =
      JSON.parse(localStorage.getItem("pendingUpdates")) || [];
    if (pendingUpdates.length === 0) return;

    pendingUpdates.forEach((update) => {
      // Use your updateData hook for each pending update
      updateData(update.id, update.data)
        .then((updatedBook) => {
          if (updatedBook) {
            // Remove successful update from pending
            const newPending = pendingUpdates.filter(
              (item) =>
                !(
                  item.id === update.id &&
                  JSON.stringify(item.data) === JSON.stringify(update.data)
                )
            );
            localStorage.setItem("pendingUpdates", JSON.stringify(newPending));
          }
        })
        .catch((error) => {
          console.error("Sync failed:", error);
        });
    });
  };

  const onSearch = (value, _e) => {
    const searchValue = value.trim().split(" ").join("+");

    if (navigator.onLine) {
      setSearchTerm(searchValue);
    } else if (value) {
      const found = books.some(
        (book) =>
          book.title.toLowerCase().includes(value.toLowerCase()) ||
          book.authors.toLowerCase().includes(value.toLowerCase())
      );

      if (!found) {
        message.info(
          "No books found in local cache. Connect to internet to search."
        );
      }
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteData(id);
      const updatedBooks = books.filter((book) => book.key !== id);
      setBooks(updatedBooks);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedBooks));
      console.log(updatedBooks);
    } catch (error) {
      console.log(error.message);
      toast.error("Unable to delete book: ", error.message);
    }
  };

  const handleConfirmDelete = (record) => {
    setBookToDelete(record);
    setConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setConfirmModal(false);
    setBookToDelete(null);
  };

  const handleDeleteConfirmed = () => {
    if (bookToDelete) {
      handleDelete(bookToDelete.key);
    }

    closeConfirmModal();
  };

  const handleEditClick = (book) => {
    if (!book) return;
    setEditingId(book.key);
    setIsEditMode(true);
    setShowEditingmodal(true);
    form.setFieldsValue({
      title: book.title,
      authors: book.authors,
    });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setShowEditingmodal(true);
    setEditingId(null);
  };

  const handleModalClose = () => {
    setShowEditingmodal(false);
    setEditingId(null);
    setIsEditMode(false);
    form.resetFields();
  };

  useEffect(() => {
    if (showEditingModal && titleInput.current) {
      setTimeout(() => titleInput.current.focus(), 0);
    }
  }, [showEditingModal]);

  const handleViewLocation = (book) => {
    navigate("/book-details-location", { state: book });
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditMode) {
        const updatedBook = await updateData(editingId, {
          title: values.title,
          authors: values.authors,
        });

        if (updatedBook) {
          const updatedBooks = books.map((book) =>
            book.key === editingId ? updatedBook : book
          );
          setBooks(updatedBooks);

          toast.success(`Book ${values.title} updated`);
        }
      } else {
        const saved = await postData({
          title: values.title,
          authors: values.authors,
          thumbnail: "https://via.placeholder.com/80x120?text=No+Image",
        });
        const updatedBooks = [...books, saved];
        setBooks(updatedBooks);
        toast.success(`Book: ${values.title} added`);
      }
      handleModalClose();
    } catch (error) {
      console.error("Error updating the Book: ", error.message);
      toast.error("Error updating the Book: ", error.message);
    }
  };

  useEffect(() => {
    return () => {
      setShowEditingmodal(false);
      setEditingId(null);
    };
  }, []);

  const bookFormProps = {
    isEditMode,
    showEditingModal,
    titleInput,
    handleModalClose,
    form,
    handleSubmit,
  };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (src) => <Image src={src} alt="Book" width={80} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (_, record) => (
        <Link to={`book-details-params/${record.key}`}>{record.title}</Link>
      ),
    },
    {
      title: "Author(s)",
      dataIndex: "authors",
      key: "authors",
      sorter: (a, b) => a.authors.localeCompare(b.authors),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (!record) return null;
        return (
          <Space size="middle">
            <ReusableButton
              title="Edit"
              classes={[
                "px-3",
                "rounded",
                "border",
                "border-solid",
                "border-black",
                "hover:bg-blue-600",
                "hover:text-white",
                "hover:border-transparent",
              ]}
              onClick={() => handleEditClick(record)}
            />
            <ReusableButton
              title="Delete"
              onClick={() => handleConfirmDelete(record)}
            />
            <ReusableButton
              title="Details"
              onClick={() => handleViewLocation(record)}
            />
          </Space>
        );
      },
    },
  ];
  return (
    <div
      className={`p-5 min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-white text-gray-800"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-5 ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        Books from Google API
      </h1>
      <div className="flex w-full justify-between mb-4">
        <Search
          placeholder="Search Book"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSearch={onSearch}
          style={{
            background: theme === "dark" ? "#1f2937" : "#fff",
            color: theme === "dark" ? "#f9fafb" : "#111827",
            borderColor: theme === "dark" ? "#374151" : "#d1d5db",
          }}
          className="w-72"
          allowClear
        />
        <Button
          type="primary"
          onClick={handleAddClick}
          className={`${
            theme === "light"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-700 hover:bg-green-800"
          } text-white`}
        >
          Add Book
        </Button>
      </div>
      <Input
        placeholder="Filter by title or author"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          background: theme === "dark" ? "#1f2937" : "#fff",
          color: theme === "dark" ? "#f9fafb" : "#111827",
          borderColor: theme === "dark" ? "#374151" : "#d1d5db",
        }}
        className="w-72 mb-4 p-2 rounded-lg"
        allowClear
      />
      <Table
        columns={columns}
        dataSource={filteredBooks}
        loading={loading}
        pagination={{
          pageSize: pagination.pageSize,
          total: filteredBooks.length,
          showSizeChanger: true,
          pageSizeOptions: ["3", "5", "10"],
          onChange: (page, pageSize) => {
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize,
            }));
          },
          onShowSizeChange: (current, size) => {
            setPagination({
              current: 1,
              pageSize: size,
            });
          },
        }}
        className={`rounded-lg ${theme === "dark" ? "dark" : ""} ${
          theme === "dark"
            ? "bg-gray-800 [&_td]:bg-gray-800 [&_th]:bg-gray-800 [&_tr]:border-gray-700 text-gray-100 [&_td]:text-gray-100 [&_th]:text-gray-100"
            : "bg-white [&_td]:bg-white [&_th]:bg-white text-gray-800 [&_td]:text-gray-800 [&_th]:text-gray-800"
        }`}
        style={{
          borderColor: theme === "dark" ? "#374151" : "#d1d5db",
        }}
      />

      {showEditingModal ? <BookForm {...bookFormProps} /> : null}
      <Modal
        title="Confirm Deletion"
        open={showConfirmModal}
        onCancel={closeConfirmModal}
        footer={null}
      >
        <span
          className={`${theme === "light" ? "text-gray-800" : "text-white"}`}
        >
          Are you sure you want to delete <strong>{bookToDelete?.title}</strong>
        </span>

        <div className="flex justify-end gap-4">
          <button
            onClick={closeConfirmModal}
            className={`px-4 py-2 rounded hover:cursor-pointer ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirmed}
            className={`px-4 py-2 text-white rounded hover:cursor-pointer ${
              theme === "light"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-700 hover:bg-red-800"
            }`}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BookTable;

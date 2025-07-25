import { Button, Form, Image, Modal, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Input } from "antd";
import { useDelete } from "../hooks/useDelete";
import { useUpdate } from "../hooks/useUpdate";
import toast from "react-hot-toast";
import { usePost } from "../hooks/usePost";
import { useTheme } from "../context/useTheme";
const { Search } = Input;

const LOCAL_STORAGE_KEY = "cachedbooks";

const initialForm = {
  title: "",
  authors: "",
};

const BookTable = () => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const base_URL = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;
  const { data, loading, error } = useFetch(base_URL);
  const [books, setBooks] = useState(() => {
    try {
      const savedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedBooks ? JSON.parse(savedBooks) : [];
    } catch (error) {
      console.error("Failed to set books");
      return [];
    }
  });
  const { updateData, updateError } = useUpdate();
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

  useEffect(() => {
    const fetchBooks = () => {
      if (data) {
        const items = data.items || [];

        const formattedBooks = items
          .filter((item) => item != null)
          .map((item) => {
            const volume = item.volumeInfo;
            let thumbnail =
              volume.imageLinks?.thumbnail ||
              "https://via.placeholder.com/80x120?text=No+Image";

            if (thumbnail.startsWith("http://")) {
              thumbnail = thumbnail.replace("http://", "https://");
            }

            return {
              key: item.id,
              title: volume.title || "No Title",
              thumbnail,

              authors: volume.authors?.join(", ") || "Unknown",
            };
          })
          .filter((book) => book != null);

        setBooks(formattedBooks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formattedBooks));
      }
    };

    fetchBooks();
  }, [data]);

  const onSearch = (value, _e, info) => {
    const searchValue = value.trim().split(" ").join("+");

    setSearchTerm(searchValue);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    await deleteData(id);
    const updatedBooks = books.filter((book) => book.key !== id);
    setBooks(updatedBooks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedBooks));
    console.log(updatedBooks);
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

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setForm((prev) => ({ ...prev, [name]: value }));
  //   };

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

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [filteredBooks]);

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
            <button onClick={() => handleEditClick(record)}>Edit</button>
            <button onClick={() => handleDelete(record.key)}>Delete</button>
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
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["3", "5", "10"],
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
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

      {showEditingModal ? (
        <Modal
          title={isEditMode ? "Edit Book" : "Add New Book"}
          open={showEditingModal}
          onCancel={handleModalClose}
          footer={null}
          className={`${theme === "dark" ? "dark-modal dark" : "light"}`}
          styles={{
            content: {
              background: theme === "dark" ? "#1f2937" : "#fff",
              color: theme === "dark" ? "#f9fafb" : "#111827",
            },
            header: {
              background: theme === "dark" ? "#1f2937" : "#fff",
              borderColor: theme === "dark" ? "#374151" : "#d1d5db",
            },
          }}
        >
          <Form
            form={form}
            className="space-y-4"
            onFinish={handleSubmit}
            initialValues={{ title: "", authors: "" }}
          >
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Please enter book title" }]}
            >
              <Input
                type="text"
                name="title"
                ref={titleInput}
                style={{
                  background: theme === "dark" ? "#111827" : "#fff",
                  color: theme === "dark" ? "#f9fafb" : "#111827",
                  borderColor: theme === "dark" ? "#374151" : "#d1d5db",
                }}
                className="w-full p-2 rounded-lg"
                placeholder="Book Title"
                allowClear
                required
              />
            </Form.Item>

            <Form.Item
              name="authors"
              rules={[
                { required: true, message: "Please enter author name(s)" },
              ]}
            >
              <Input
                type="text"
                name="authors"
                style={{
                  background: theme === "dark" ? "#111827" : "#fff",
                  color: theme === "dark" ? "#f9fafb" : "#111827",
                  borderColor: theme === "dark" ? "#374151" : "#d1d5db",
                }}
                placeholder="Author Name(s)"
                allowClear
                required
              />
            </Form.Item>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className={`px-4 py-2 rounded hover:cursor-pointer ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-4 py-2 text-white rounded hover:cursor-pointer ${
                  theme === "light"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-700 hover:bg-green-800"
                }`}
              >
                {isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
};

export default BookTable;

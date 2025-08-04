import { Form, Input, Modal } from "antd";
import { useTheme } from "../context/useTheme";

const BookForm = ({
  isEditMode,
  showEditingModal,
  handleModalClose,
  form,
  handleSubmit,
  titleInput,
}) => {
  const { theme } = useTheme();

  return (
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
          rules={[{ required: true, message: "Please enter author name(s)" }]}
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
  );
};

export default BookForm;

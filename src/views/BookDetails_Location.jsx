import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { Button, Col, Row, Tag, Typography } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  ReadOutlined,
  StarFilled,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const BookDetailsPage = () => {
  const { state: book } = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Extract industry identifiers
  const getIdentifier = (type) => {
    if (!book.industryIdentifiers) return null;
    const identifier = book.industryIdentifiers.find((id) => id.type === type);
    return identifier ? identifier.identifier : null;
  };

  const isbn10 = getIdentifier("ISBN_10");
  const isbn13 = getIdentifier("ISBN_13");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAuthors = (authors) => {
    if (!authors) return "Unknown Author";
    if (Array.isArray(authors)) return authors.join(", ");
    return authors; // Handle string case
  };

  const categoriesArray = Array.isArray(book.categories)
    ? typeof book.categories === "string"
      ? book.categories
      : [book.categories]
    : ["General"];

  return (
    <div
      className={`min-h-screen py-10 px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <Text
          className={`text-sm mb-4 block ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Books / {categoriesArray} / {book.title}
        </Text>

        {/* Main Content */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Row gutter={[32, 32]} className="p-6 md:p-8">
            {/* Book Cover */}
            <Col xs={24} md={8}>
              <div className="flex flex-col items-center">
                <img
                  src={
                    book.thumbnail ||
                    book.smallThumbnail ||
                    "https://via.placeholder.com/300x450?text=No+Cover"
                  }
                  alt={book.title}
                  className="w-full max-w-xs rounded-lg shadow-xl border-2 border-gray-200"
                />

                <div className="mt-4 flex gap-2">
                  <Button
                    type="primary"
                    href={book.previewLink}
                    target="_blank"
                    icon={<ReadOutlined />}
                    className="flex items-center"
                  >
                    Preview
                  </Button>

                  <Button
                    href={book.infoLink}
                    target="_blank"
                    icon={<InfoCircleOutlined />}
                    className="flex items-center"
                  >
                    More Info
                  </Button>
                </div>
              </div>
            </Col>

            {/* Book Details */}
            <Col xs={24} md={16}>
              <div>
                {/* Title & Subtitle */}
                <Title
                  level={1}
                  className={`mb-1 !font-serif ${
                    isDark ? "!text-white" : "!text-gray-900"
                  }`}
                >
                  {book.title}
                </Title>

                {book.subtitle && (
                  <Title
                    level={4}
                    className={`mt-0 !font-serif ${
                      isDark ? "!text-gray-300" : "!text-gray-600"
                    }`}
                  >
                    {book.subtitle}
                  </Title>
                )}

                {/* Authors */}
                <div className="mb-4">
                  <Text
                    className={`text-lg font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    by {formatAuthors(book.authors)}
                  </Text>
                </div>

                {/* Rating */}
                {book.averageRating && (
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <StarFilled
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(book.averageRating)
                              ? "text-yellow-500"
                              : isDark
                              ? "text-gray-600"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <Text
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    >
                      {book.averageRating} ({book.ratingsCount || "No"} ratings)
                    </Text>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                  <div>
                    <Text
                      strong
                      className="block text-gray-500 dark:text-gray-400"
                    >
                      <BookOutlined className="mr-2" /> Publisher
                    </Text>
                    <Text
                      className={isDark ? "text-gray-300" : "text-gray-300"}
                    >
                      {book.publisher || "Unknown"}
                    </Text>
                  </div>

                  <div>
                    <Text
                      strong
                      className="block text-gray-500 dark:text-gray-400"
                    >
                      <CalendarOutlined className="mr-2" /> Published
                    </Text>
                    <Text
                      className={isDark ? "text-gray-300" : "text-gray-300"}
                    >
                      {formatDate(book.publishedDate)}
                    </Text>
                  </div>

                  <div>
                    <Text
                      strong
                      className="block text-gray-500 dark:text-gray-400"
                    >
                      <GlobalOutlined className="mr-2" /> Language
                    </Text>
                    <Text
                      className={isDark ? "text-gray-300" : "text-gray-300"}
                    >
                      {book.language?.toUpperCase() || "N/A"}
                    </Text>
                  </div>

                  <div>
                    <Text
                      strong
                      className="block text-gray-500 dark:text-gray-400"
                    >
                      <ReadOutlined className="mr-2" /> Pages
                    </Text>
                    <Text
                      className={isDark ? "text-gray-300" : "text-gray-300"}
                    >
                      {book.pageCount || "Unknown"}
                    </Text>
                  </div>

                  {isbn10 && (
                    <div>
                      <Text
                        strong
                        className="block text-gray-500 dark:text-gray-400"
                      >
                        ISBN-10
                      </Text>
                      <Text
                        className={isDark ? "text-gray-300" : "text-gray-300"}
                      >
                        {isbn10}
                      </Text>
                    </div>
                  )}

                  {isbn13 && (
                    <div>
                      <Text
                        strong
                        className="block text-gray-500 dark:text-gray-400"
                      >
                        ISBN-13
                      </Text>
                      <Text
                        className={isDark ? "text-gray-300" : "text-gray-300"}
                      >
                        {isbn13}
                      </Text>
                    </div>
                  )}
                </div>

                {/* Categories */}
                {categoriesArray && (
                  <div className="mb-6">
                    <Text
                      strong
                      className={`block mb-2 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Categories:
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {categoriesArray.map((category, index) => (
                        <Tag
                          key={index}
                          className={`px-3 py-1 rounded-full ${
                            isDark
                              ? "bg-gray-700 text-blue-300"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {category}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <Text
                    strong
                    className={`block mb-3 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Description
                  </Text>
                  <Paragraph
                    className={`text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                    ellipsis={{
                      rows: 8,
                      expandable: true,
                      symbol: "Show more",
                    }}
                  >
                    {book.description?.replace(/<[^>]*>/g, "") ||
                      "No description available."}
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;

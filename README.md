# Book Tracker App

A modern book tracking application built with React, Tailwind CSS, and Ant Design, allowing users to:

* Search for books using the Google Books API
* Add books to a local list
* Edit and delete saved books
* Persist books in localStorage
* Filter and sort books by title or author
* Focus input with useRef, and manage global UI state

## Live Demo

[View Demo](https://react-book-tracker.vercel.app)

## Features

* Google Books API Integration – Search books by title or keyword
* Local Book List – Add books from API or manually
* Editable Book Modal – Add or update title and authors via a custom modal
* Focus Management – Uses useRef to auto-focus input on modal open
* Custom Hooks – Modular useFetch, usePost, useUpdate, useDelete
* Persistent Data – Saves books in localStorage
* Filterable List – Search by title or author in real time
* Sortable Columns – Sort books by title or authors
* Paginated Results – Ant Design table with pagination

## Tech Stack

| Tool             | Purpose                              |
| ---------------- | ------------------------------------ |
| React            | Frontend framework                   |
| Tailwind CSS     | Utility-first styling                |
| Ant Design       | UI Components (Table, Input, Layout) |
| Google Books API | Search functionality                 |
| localStorage     | Persistent state                     |
| React Hooks      | useState, useEffect, useRef          |

## Screenshots

(Optional: Add some screenshots here or gifs of your UI)
You can use Carbon or Loom to capture snippets.

## Getting Started

1. Clone the repo

```bash
git clone https://github.com/muderick/book-tracker.git
cd book-tracker
```

2. Install dependencies

```bash
npm install
```

3. Run the app

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Folder Structure

```
src/
├── components/
│   └── BookTable.jsx
│   └── FooterComponent.jsx
│   └── HeaderComponent.jsx
│   └── SideBar.jsx
│   └── TopBar.jsx
├── hooks/
│   ├── useFetch.js
│   ├── usePost.js
│   ├── useUpdate.js
│   └── useDelete.js
├── views/
│   └── About.jsx
│   └── Home.jsx
│   └── Layout.jsx
│   └── NotFound.jsx
├── App.jsx
└── index.js
```

## Future Improvements

* Mark books as read/unread
* Tag books with categories
* Firebase or Supabase integration for real user data
* Export books to PDF or CSV

## Contributing

Contributions, feedback, and ideas are welcome. Feel free to fork the repo and submit a pull request.

## License

MIT

## Contact

Built by Mumia Derick
GitHub: [https://github.com/muderick](https://github.com/muderick)

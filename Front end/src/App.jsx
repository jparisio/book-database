import React, { useEffect, useState } from "react";
import { fetchBooks, clearBooks } from "./api"; // Assuming these functions are defined
import AddBook from "./AddBook";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState(""); // Step 1: Filter state

  useEffect(() => {
    // Fetch books whenever the database is updated
    fetchBooks().then((data) => setBooks(data));
  }, [books]);

  // Function to handle clearing the database
  const handleClearBooks = async () => {
    try {
      await clearBooks();
      setBooks([]); // Clear the state after clearing the database
      alert("Books cleared successfully!");
    } catch (error) {
      alert("Failed to clear books: " + error.message);
    }
  };

  // Function to handle downloading as JSON
  const handleJSON = () => {
    const dataStr = JSON.stringify(books, null, 2); // Format and add indentation
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "books.json"; // filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Cleanup
    alert("Books JSON file downloaded successfully!");
  };

  // Function to handle downloading as CSV
  const handleCSV = () => {
    const csvRows = [
      ["Title", "Author", "Genre", "Publication Date", "ISBN"], // Header of CSV
      ...books.map((book) => [
        book.title,
        book.author,
        book.genre,
        book.publication_date,
        book.isbn,
      ]),
    ];

    const csvString = csvRows.map((row) => row.join(",")).join("\n"); // Convert array to CSV string
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "books.csv"; // Specify the filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Cleanup

    alert("Books CSV file downloaded successfully!");
  };

  // Filtered books based on the filter input
  const filteredBooks = books.filter((book) =>
    Object.values(book).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  // anim variants
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <div>
      <h1>Book Inventory</h1>
      <div>
        <h2>Add a new book</h2>
        <AddBook setBooks={setBooks} />{" "}
      </div>

      {/* Filter input */}
      <div>
        <h2>Filter Books</h2>
        <input
          type="text"
          placeholder="Filter by title, author, genre, publication date, or ISBN"
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Update filter state
        />
      </div>

      <h2>Books List</h2>
      <ul>
        <AnimatePresence>
          {filteredBooks.map(
            (
              book // Use filteredBooks for rendering
            ) => (
              <motion.ul
                className="book-item"
                key={book.id}
                variants={itemVariants}
                initial="hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                animate="visible"
                exit="exit"
              >
                <em>{book.title}</em> <strong>by {book.author}</strong>:{" "}
                {book.genre} {book.publication_date} {book.isbn}
              </motion.ul>
            )
          )}
        </AnimatePresence>
      </ul>
      <div className="buttons-list">
        {/* Add buttons for downloading books */}
        <motion.button
          onClick={handleJSON}
          whileTap={{
            scale: 0.95,
          }}
        >
          JSON books
        </motion.button>
        <motion.button
          onClick={handleCSV}
          whileTap={{
            scale: 0.95,
          }}
        >
          CSV books
        </motion.button>
        {/* Add the Clear Books button */}
        <motion.button
          onClick={handleClearBooks}
          whileTap={{
            scale: 0.95,
          }}
        >
          Clear All Books
        </motion.button>
      </div>
    </div>
  );
}

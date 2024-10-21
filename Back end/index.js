const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors"); // Import the CORS package

const app = express();

app.use(cors()); // Use CORS middleware
app.use(express.json());

// Connect to the SQLite database (it will create the file if it doesn't exist)
const db = new sqlite3.Database("./books.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create a books table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  author TEXT,
  genre TEXT,
  publication_date TEXT,
  isbn TEXT
)`);

// Route to get all books
app.get("/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch books" });
    } else {
      res.json(rows);
    }
  });
});

// Route to add a book
app.post("/books", (req, res) => {
  const { title, author, genre, publication_date, isbn } = req.body;
  db.run(
    `INSERT INTO books (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)`,
    [title, author, genre, publication_date, isbn],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Failed to add book" });
      } else {
        res
          .status(201)
          .json({ id: this.lastID, message: "Book added successfully" });
      }
    }
  );
});

// Route to clear the books table
app.delete("/books", (req, res) => {
  db.run(`DELETE FROM books`, [], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to clear books" });
    } else {
      res.status(200).json({ message: "Books cleared successfully" });
    }
  });
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

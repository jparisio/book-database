import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./AddBook.css";

export default function AddBook() {
  const initialBookData = {
    title: "",
    author: "",
    genre: "",
    publication_date: "",
    isbn: "",
  };

  const [bookData, setBookData] = useState(initialBookData);

  const validateDate = (value) => {
    if (value <= 1700 || value > new Date().getFullYear()) {
      return false;
    } else {
      return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate input based on field name
    if (name === "title" || name === "author" || name === "genre") {
      // Allow only letters and spaces
      const regex = /^[a-zA-Z\s]*$/;
      if (regex.test(value) || value === "") {
        setBookData({ ...bookData, [name]: value });
      }
    } else if (name === "publication_date") {
      // Allow only numbers and check if it's a valid year
      const regex = /^[0-9]*$/;
      if (regex.test(value) || value === "") {
        if (value.length <= 4) {
          setBookData({ ...bookData, [name]: value });
        }
      }
    } else if (name === "isbn") {
      // Allow only numbers
      const regex = /^[0-9]*$/;
      if (regex.test(value) || value === "") {
        setBookData({ ...bookData, [name]: value });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if all fields are filled
    const isEmpty = Object.values(bookData).some(
      (value) => value.trim() === ""
    );

    if (isEmpty) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate publication year
    if (!validateDate(parseInt(bookData.publication_date))) {
      alert("Please enter a valid publication year");
      return;
    }
    axios
      .post("http://localhost:3001/books", bookData)
      .then((response) => {
        console.log("Book added:", response.data);
        setBookData(initialBookData); // Clear the form by resetting the state
      })
      .catch((error) => {
        console.error("There was an error adding the book:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="enter-form">
      <input
        name="title"
        placeholder="Title"
        value={bookData.title}
        onChange={handleChange}
      />
      <input
        name="author"
        placeholder="Author"
        value={bookData.author}
        onChange={handleChange}
      />
      <input
        name="genre"
        placeholder="Genre"
        value={bookData.genre}
        onChange={handleChange}
      />
      <input
        name="publication_date"
        placeholder="Publication Date"
        value={bookData.publication_date}
        onChange={handleChange}
      />
      <input
        name="isbn"
        placeholder="ISBN"
        value={bookData.isbn}
        onChange={handleChange}
      />
      <motion.button
        type="submit"
        whileTap={{
          scale: 0.95,
        }}
      >
        Add Book
      </motion.button>
    </form>
  );
}

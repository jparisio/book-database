export const fetchBooks = async () => {
  const response = await fetch("http://localhost:3001/books");
  if (!response.ok) {
    throw new Error("Error fetching books: " + response.statusText);
  }
  return response.json();
};

export const clearBooks = async () => {
  const response = await fetch("http://localhost:3001/books", {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error clearing books: " + response.statusText);
  }
  return response.json();
};

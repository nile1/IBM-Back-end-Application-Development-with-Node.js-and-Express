const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

const booksArray = Object.values(books);

let users = [];

const isValid = (username) => {
  let userIsValid = users.filter((user) => {
    return user.username === username;
  });
  if (userIsValid.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let userIsValid = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (userIsValid.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const loginName = req.body.username;
  const loginPass = req.body.password;
  if (loginName === "" || loginPass === "") {
    return res.status(400).json({ message: "Username or password is empty" });
  }
  if (authenticatedUser(loginName, loginPass)) {
    let token = jwt.sign(
      { username: loginName, password: loginPass },
      "access"
    );
    req.session.authorization = { accessToken: token };
    return res.status(200).json({ message: "User logged in" });
  }
  return res.status(400).json({ message: "Invalid username or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  let book = booksArray.find((book) => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.reviews[username] = review;
  return res
    .status(200)
    .json({ message: "Review added / updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/delete/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  let book = booksArray.find((book) => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

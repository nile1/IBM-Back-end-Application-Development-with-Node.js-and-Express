const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

const booksArray = Object.values(books);

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    return res.status(400).json({ message: "Username or password is empty" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  } else {
    users.push({ username, password });
    return res.status(200).json({ message: "User created" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const filteredBooks = booksArray.filter((book) => book.isbn === isbn);
  return res.send(JSON.stringify(filteredBooks));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const filteredBooks = booksArray.filter((book) => book.author === author);
  return res.send(JSON.stringify(filteredBooks));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const filteredBooks = booksArray.filter((book) => book.title === title);
  return res.send(JSON.stringify(filteredBooks));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = booksArray.find((book) => book.isbn === isbn);
  return res.send(JSON.stringify(book.reviews));
});

//Async routes

//Task 10 - Async get all books
public_users.get("/async/", async (req, res) => {
  try {
    const result = await axios.get("http://localhost:5000/");
    return res.send(JSON.stringify(result.data));
  } catch (error) {
    console.error(error);
  }
});

//Task 11 - Async get books based on ISBN
public_users.get("/async/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const result = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.send(JSON.stringify(result.data));
  } catch (error) {
    console.error(error);
  }
});

//Task 12 - Async get books based on author
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const result = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    return res.send(JSON.stringify(result.data));
  } catch (error) {
    console.error(error);
  }
});

//Task 13 - Async get books based on title
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const result = await axios.get(
      `http://localhost:5000/title/${req.params.title}`
    );
    return res.send(JSON.stringify(result.data));
  } catch (error) {
    console.error(error);
  }
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const {username, password} = req.body
    const user = users.filter(user=>user.username==username)

    if(user.length > 0){
        return res.send("User already exist")
    }
  
        users.push({username, password})
    
    return res.status(300).json({ message: "registred successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let book = books[req.params.isbn]
    return res.send(JSON.stringify(book));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let booksByAuthor = Object.values(books).filter(book => book.author == req.params.author)
    return res.status(300).json({ message: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let booksByTitle = Object.values(books).filter(book => book.title == req.params.title)
    return res.status(300).json({ message: booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const bookReview = books[req.params.isbn]['reviews']
    return res.status(300).json({ message: bookReview });
});

module.exports.general = public_users;

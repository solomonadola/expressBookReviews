const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const {username, password} = req.body
    const user = users.filter(user=>user.username==username)

    if(user.length > 0){
        return res.send("Customer already exist")
    }
  
        users.push({username, password})
    
    return res.status(300).json({ message: "Customer successfully registred" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

const getAllBooks = async () => {
    try {
      const response = await axios.get(`bookurl`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({message: "Book with ISBN: "+ isbn +" Not Found!"});
   });

   const getBookByISBN = async (isbn) => {
    try {
      const response = await axios.get(`bookbaseurl/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let book = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
    if (book.length > 0) {
      return res.status(200).json(book);
    }
    return res.status(404).json({message: "Book with Author: "+ author +" Not Found!"});
  });
  
  const getBookByAuthor = async (author) => {
    try {
      const response = await axios.get(`booksbaseurl/author/${author}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let book = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
    if (book.length > 0) {
      book = book[0];
      return res.status(200).json(book);
    }
    return res.status(404).json({message: "Book with Title: "+ title +" Not Found!"});
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      return res.status(200).json(book.reviews);
    }
    return res.status(404).json({message: "Reviws for Book with ISBN: "+ isbn +" Not Found!"});
  });

module.exports.general = public_users;

import { 
    getAllBooks,
    getBookById,
    postBook
} from "../models/books.js";

import { getAuthorById } from "../models/authors.js";

import {
    body, 
    validationResult
} from "express-validator";

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error("GET /books failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

const getBookByIdHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const book = await getBookById(requestedId);
        if (!book) {
            return res.status(404).json({ "message": "Book not found" });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error("GET /books/:id failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

const postBookHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "message": "Invalid book data." });
    }

    try {
        const bookData = {
            id: req.body.id,
            authorId: req.body.authorId,
            title: req.body.title,
            publicationDate: req.body.publicationDate
        }

        const author = await getAuthorById(bookData.authorId);
        if (!author) {
            return res.status(400).json({ "message": "Invalid authorId. Author does not exist." });
        }

        const result = await postBook(bookData);
        return res.status(201).json({ "message": "Book created successfully", "bookId": result.insertedId });

    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({ "message": "The request conflicts with existing data." });
        }
        console.error("POST /books failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

export { 
    getBooksHandler,
    getBookByIdHandler,
    postBookHandler
};
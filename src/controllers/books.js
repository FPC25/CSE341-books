import { 
    getAllBooks,
    getBookById,
    postBook,
    putBook,
    deleteBook
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
            publishedDate: req.body.publishedDate
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

const putBookHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "message": "Invalid book data." });
    }

    const requestedId = req.params.id;

    try {
        const book = await getBookById(requestedId);
        if (!book) {
            return res.status(404).json({ "message": "Book not found" });
        }

        const updateData = {};
        if (req.body.authorId !== undefined) {
            const author = await getAuthorById(req.body.authorId);
            if (!author) {
                return res.status(400).json({ "message": "Invalid authorId. Author does not exist." });
            }
            updateData.authorId = req.body.authorId;
        }
        if (req.body.title !== undefined) {
            updateData.title = req.body.title;
        }
        if (req.body.publishedDate !== undefined) {
            updateData.publishedDate = req.body.publishedDate;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(200).json({
                "message": "No changes were made.",
                book
            })
        };

        const updatedBook = await putBook(requestedId, updateData);
        if (!updatedBook) {
            // if the book is deleted before the update and after the search, the updatedBook will be null, so we need to check for that
            return res.status(404).json({ "message": "Book not found" });
        }
        return res.status(200).json({ "message": "Book updated successfully", "book": updatedBook });

    } catch (error) {
        console.error("PUT /books/:id failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

const deleteBookHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const book = await getBookById(requestedId);
        if (!book) {
            return res.status(404).json({ "message": "Book not found" });
        }

        const result = await deleteBook(requestedId);
        if (result.deletedCount === 0) {
            return res.status(404).json({ "message": "Book not found" });
        }

        return res.status(204).json({ "message": "Book deleted successfully" });
    } catch (error) {
        console.error("DELETE /books/:id failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

export { 
    getBooksHandler,
    getBookByIdHandler,
    postBookHandler,
    putBookHandler,
    deleteBookHandler
};
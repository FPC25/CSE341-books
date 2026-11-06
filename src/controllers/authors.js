import { 
    getAllAuthors,
    getAuthorById,
    getBooksFromAuthor,
    postAuthor
} from "../models/authors.js";

import {
    body, 
    validationResult
} from "express-validator";

const getAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        console.error("GET /authors failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

const getAuthorByIdHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const author = await getAuthorById(requestedId);
        if (!author) {
            return res.status(404).json({ "message": "Author not found" });
        }
        return res.status(200).json(author);
    } catch (error) {
        console.error("GET /authors/:id failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

const getBooksFromAuthorHandler = async (req, res) => {
    const requestedId = req.params.id;
    try {
        const author = await getAuthorById(requestedId);
        if (!author) {
            return res.status(404).json({ "message": "Author not found" });
        }
        const books = await getBooksFromAuthor(requestedId);
        return res.status(200).json(books);
    } catch (error) {
        console.error("GET /authors/:id/books failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

const postAuthorHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "message": "Invalid author data." });
    }

    try {
        const authorData = {
            id: req.body.id,
            name: req.body.name,
            birthYear: req.body.birthYear,
        };
        const result = await postAuthor(authorData);
        return res.status(201).json(result);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({ "message": "The request conflicts with existing data." });
        }
        console.error("POST /authors failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

export { 
    getAuthorsHandler,
    getAuthorByIdHandler,
    getBooksFromAuthorHandler,
    postAuthorHandler
}
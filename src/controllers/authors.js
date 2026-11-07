import { 
    getAllAuthors,
    getAuthorById,
    getBooksFromAuthor,
    postAuthor,
    putAuthor,
    deleteAuthor
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

const putAuthorHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "message": "Invalid author data." });
    }

    const requestedId = req.params.id;
    try {
        // Validates that the author exists before attempting to update
        const author = await getAuthorById(requestedId);
        if (!author) {
            return res.status(404).json({ "message": "Author not found" });
        }

        // Prepare the update data based on the request body
        const updateData = {};
        if (req.body.name !== undefined) {
            updateData.name = req.body.name;
        }
        if (req.body.birthYear !== undefined) {
            updateData.birthYear = req.body.birthYear;
        }

        // If no update data is provided, return the existing author data
        if (Object.keys(updateData).length === 0) {
            return res.status(200).json({
                "message": "No changes were made.",
                author
            });
        } 
        
        // Proceed with the update
        const updatedAuthor = await putAuthor(requestedId, updateData);
        // if the author is deleted before the update and after the search, the updatedAuthor will be null, so we need to check for that
        if (!updatedAuthor) {
            return res.status(404).json({ "message": "Author not found" });
        }
        return res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error("PUT /authors/:id failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

const deleteAuthorHandler = async (req, res) => {
    const requestedId = req.params.id;
    try {
        const author = await getAuthorById(requestedId);
        if (!author) {
            return res.status(404).json({ "message": "Author not found" });
        }

        const books = await getBooksFromAuthor(requestedId);
        if (books.length > 0) {
            return res.status(409).json({ "message": "The request conflicts with existing data." });
        }

        const result = await deleteAuthor(requestedId);
        if (result.deletedCount === 0) { // This means the author was not found or already deleted before the delete operation and after the check for existence, so we return a 404.
            return res.status(404).json({ "message": "Author not found" });
        }
        return res.status(204).send();

    } catch (error) {
        console.error("DELETE /authors/:id failed:", error.message);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

export { 
    getAuthorsHandler,
    getAuthorByIdHandler,
    getBooksFromAuthorHandler,
    postAuthorHandler,
    putAuthorHandler,
    deleteAuthorHandler
}
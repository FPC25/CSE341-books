import express from "express";
import { 
    getBooksHandler,
    getBookByIdHandler
} from "./controllers/books.js";

const router = express.Router();

// Define routes for all books
router.get("/books", getBooksHandler);

// Define route for a single book by ID
router.get("/books/:id", getBookByIdHandler);

export default router;
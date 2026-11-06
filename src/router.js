import express from "express";
import { 
    getBooksHandler,
    getBookByIdHandler
} from "./controllers/books.js";

import {
    getAuthorsHandler,
    getAuthorByIdHandler,
    getBooksFromAuthorHandler,
} from "./controllers/authors.js";

import { body } from "express-validator";

const router = express.Router();

const allowedAuthorFields = new Set(["id", "name", "birthYear"]);

const authorValidationRules = [
    body().custom((value) => {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).every((key) => { return allowedAuthorFields.has(key); })
        );
    }),

    body("id")
        .exists()
        .bail()
        .isString()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape(), 
        
    body("name")
        .exists()
        .bail()
        .isString()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape(),

    body("birthYear").custom(
        (value) => {
            return (
                typeof value === "number" &&
                Number.isInteger(value) &&
                value <= new Date().getUTCFullYear()
            );
        }
    ),
];


// Books routes
// Define routes for all books
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: MongoDB document identifier
 *                   id:
 *                     type: string
 *                   authorId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   publicationDate:
 *                     type: string
 *                     format: date
 *                 required:
 *                   - id
 *                   - authorId
 *                   - title
 *                   - publicationDate
 *                   - _id
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/books", getBooksHandler);

// Define route for a single book by ID
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: MongoDB document identifier
 *                 id:
 *                   type: string
 *                 authorId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 publicationDate:
 *                   type: string
 *                   format: date
 *               required:
 *                 - id
 *                 - authorId
 *                 - title
 *                 - publicationDate
 *                 - _id
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/books/:id", getBookByIdHandler);

// Authors routes
/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: List of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: MongoDB document identifier
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   birthYear:
 *                     type: integer
 *                 required:
 *                   - _id
 *                   - id
 *                   - name
 *                   - birthYear
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/authors", getAuthorsHandler);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the author to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: MongoDB document identifier
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 birthYear:
 *                   type: integer
 *               required:
 *                 - _id
 *                 - id
 *                 - name
 *                 - birthYear
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Author not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/authors/:id", getAuthorByIdHandler);

/**
 * @swagger
 * /authors/{id}/books:
 *   get:
 *     summary: Get all books by an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books by the author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: MongoDB document identifier
 *                   id:
 *                     type: string
 *                   authorId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   publicationDate:
 *                     type: string
 *                     format: date
 *                 required:
 *                   - _id
 *                   - id
 *                   - authorId
 *                   - title
 *                   - publicationDate
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Author not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/authors/:id/books", getBooksFromAuthorHandler);

export default router;
import express from "express";
import { 
    getBooksHandler,
    getBookByIdHandler
} from "./controllers/books.js";

import {
    getAuthorsHandler,
    getAuthorByIdHandler,
    getBooksFromAuthorHandler,
    postAuthorHandler,
    putAuthorHandler
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

const allowedAuthorUpdateFields = new Set(["name", "birthYear"]);

const authorUpdateValidationRules = [
    body().custom((value) => {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).every((key) => { return allowedAuthorUpdateFields.has(key); })
        );
    }),
        
    body("name")
        .optional()
        .isString()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape(),

    body("birthYear")
        .optional()
        .custom((value) => {
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

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *                 example: a1
 *                 minLength: 1
 *                 description: Trimmed, non-empty string; HTML characters are escaped before storage.
 *               name:
 *                 type: string
 *                 example: Jane Austen
 *                 minLength: 1
 *                 description: Trimmed, non-empty string; HTML characters are escaped before storage.
 *               birthYear:
 *                 type: integer
 *                 description: Must not be later than the current UTC year.
 *                 example: 1775
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Author inserted into MongoDB
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - acknowledged
 *                 - insertedId
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   example: true
 *                 insertedId:
 *                   type: string
 *                   description: MongoDB-generated document identifier
 *                   example: 665f1a2b3c4d5e6f7a8b9c0d
 *       400:
 *         description: Invalid author data or malformed JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               invalidAuthorData:
 *                 summary: Missing or invalid fields, or additional fields
 *                 value:
 *                   message: Invalid author data.
 *               malformedJson:
 *                 summary: Malformed JSON request body
 *                 value:
 *                   message: Malformed JSON request body.
 *       409:
 *         description: An author with this ID already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The request conflicts with existing data.
 *       500:
 *         description: Unexpected server or database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/authors", authorValidationRules, postAuthorHandler);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Partially update an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom ID of the author to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Austen
 *                 minLength: 1
 *                 description: Optional; trimmed, non-empty string; HTML characters are escaped before storage.
 *               birthYear:
 *                 type: integer
 *                 description: Optional; must not be later than the current UTC year.
 *                 example: 1775
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Author updated, or returned unchanged when the request body is empty
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   required:
 *                     - _id
 *                     - id
 *                     - name
 *                     - birthYear
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: MongoDB document identifier
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     birthYear:
 *                       type: integer
 *                 - type: object
 *                   required:
 *                     - message
 *                     - author
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: No changes were made.
 *                     author:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         birthYear:
 *                           type: integer
 *       400:
 *         description: Invalid author data or malformed JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               invalidAuthorData:
 *                 summary: Invalid fields or additional fields
 *                 value:
 *                   message: Invalid author data.
 *               malformedJson:
 *                 summary: Malformed JSON request body
 *                 value:
 *                   message: Malformed JSON request body.
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Author not found
 *       500:
 *         description: Unexpected server or database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.put("/authors/:id", authorUpdateValidationRules, putAuthorHandler);

export default router;
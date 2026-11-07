import express from "express";
import { 
    getBooksHandler,
    getBookByIdHandler,
    postBookHandler
} from "./controllers/books.js";

import {
    getAuthorsHandler,
    getAuthorByIdHandler,
    getBooksFromAuthorHandler,
    postAuthorHandler,
    putAuthorHandler,
    deleteAuthorHandler
} from "./controllers/authors.js";

import { body } from "express-validator";

const router = express.Router();

const allowedPostBookFields = new Set(["id", "authorId", "title", "publishedDate"]);

const bookPostValidationRules = [
    body().custom((value) => {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).every((key) => { return allowedPostBookFields.has(key); })
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
        .escape()
        .isLength({ min: 2 })
        .bail(), 

    body("authorId")
        .exists()
        .bail()
        .isString()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape()
        .isLength({ min: 2 })
        .bail(),
        
    body("title")
        .exists()
        .bail()
        .isString()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape()
        .isLength({ min: 2, max: 100 })
        .bail(),

    body("publishedDate")
        .exists()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape()
        .isISO8601({ strict: true })
        .bail(),
]

const allowedPutBookFields = new Set(["authorId", "title", "publishedDate"]);

const bookPutValidationRules = [
    body().custom((value) => {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).every((key) => { return allowedPutBookFields.has(key); })
        );
    }),

    body("authorId")
        .optional()
        .isString()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape()
        .isLength({ min: 2 })
        .bail(),
        
    body("title")
        .optional()
        .isString()
        .bail()
        .trim()
        .notEmpty()
        .bail()
        .escape()
        .isLength({ min: 2, max: 100 })
        .bail(),

    body("publishedDate")
        .optional()
        .trim()
        .notEmpty()
        .bail()
        .escape()
        .isISO8601({ strict: true })
        .bail(),
]

const postAllowedAuthorFields = new Set(["id", "name", "birthYear"]);

const postAuthorValidationRules = [
    body().custom((value) => {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            Object.keys(value).every((key) => { return postAllowedAuthorFields.has(key); })
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
 *             example:
 *               - _id: 665f1a2b3c4d5e6f7a8b9c0d
 *                 id: b1
 *                 authorId: a1
 *                 title: A book title
 *                 publicationDate: '2022-09-02'
 *               - _id: 665f1a2b3c4d5e6f7a8b9c0e
 *                 id: b2
 *                 authorId: a1
 *                 title: Another book title
 *                 publicationDate: '2002-12-27'
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
 *             example:
 *               _id: 665f1a2b3c4d5e6f7a8b9c0d
 *               id: b1
 *               authorId: a1
 *               title: A book title
 *               publicationDate: '2022-09-02'
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

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a book
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - authorId
 *               - title
 *               - publishedDate
 *             properties:
 *               id:
 *                 type: string
 *                 minLength: 2
 *                 example: b4
 *                 description: Custom book ID; trimmed and non-empty string;HTML characters are escaped before storage.
 *               authorId:
 *                 type: string
 *                 minLength: 2
 *                 example: a1
 *                 description: Must match the custom ID of an existing author.
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Example Book Title
 *                 description: Trimmed, non-empty string; HTML characters are escaped before storage.
 *               publishedDate:
 *                 type: string
 *                 format: ISO8601 date
 *                 example: '2026-01-15'
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Book inserted into MongoDB
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
 *             example:
 *               acknowledged: true
 *               insertedId: 665f1a2b3c4d5e6f7a8b9c0d
 *       400:
 *         description: Invalid book data or malformed JSON
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
 *               invalidBookData:
 *                 summary: Missing or invalid fields, unknown fields, or nonexistent author ID
 *                 value:
 *                   message: Invalid book data.
 *               malformedJson:
 *                 summary: Malformed JSON request body
 *                 value:
 *                   message: Malformed JSON request body.
 *       409:
 *         description: A book with this ID already exists
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
router.post("/books", bookPostValidationRules, postBookHandler);

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
 *             example:
 *               - _id: 665f1a2b3c4d5e6f7a8b9c0d
 *                 id: a1
 *                 name: Jane Austen
 *                 birthYear: 1775
 *               - _id: 665f1a2b3c4d5e6f7a8b9c0e
 *                 id: a2
 *                 name: Mary Shelley
 *                 birthYear: 1797
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
 *             example:
 *               _id: 665f1a2b3c4d5e6f7a8b9c0d
 *               id: a1
 *               name: Jane Austen
 *               birthYear: 1775
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
 *             examples:
 *               withBooks:
 *                 summary: Author has related books
 *                 value:
 *                   - _id: 665f1a2b3c4d5e6f7a8b9c0d
 *                     id: b1
 *                     authorId: a1
 *                     title: A book title
 *                     publicationDate: '2022-09-02'
 *               noBooks:
 *                 summary: Author exists but has no books
 *                 value: []
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
 *             example:
 *               acknowledged: true
 *               insertedId: 665f1a2b3c4d5e6f7a8b9c0d
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
router.post("/authors", postAuthorValidationRules, postAuthorHandler);


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
 *             examples:
 *               updated:
 *                 summary: Author updated
 *                 value:
 *                   _id: 665f1a2b3c4d5e6f7a8b9c0d
 *                   id: a1
 *                   name: Jane Austen
 *                   birthYear: 1775
 *               unchanged:
 *                 summary: Empty request body; no changes made
 *                 value:
 *                   message: No changes were made.
 *                   author:
 *                     _id: 665f1a2b3c4d5e6f7a8b9c0d
 *                     id: a1
 *                     name: Jane Austen
 *                     birthYear: 1775
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


/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom ID of the author to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted successfully
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
 *       409:
 *         description: Conflict due to existing books associated with the author
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
router.delete("/authors/:id", deleteAuthorHandler);

export default router;
import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection("books");
    const books = await collection.find({}).toArray();
    return books;
}

const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection("books");
    const book = await collection.findOne({ "id": bookId });
    return book;
}

const postBook = async (bookData) => {
    const db = getDb();
    const collection = db.collection("books");
    const result = await collection.insertOne(bookData);
    return result;
}

export { 
    getAllBooks,
    getBookById,
    postBook
};
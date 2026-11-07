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

const putBook = async (bookId, updateData) => {
    const db = getDb()
    const collection = db.collection("books");

    if (Object.keys(updateData).length === 0) {
        return collection.findOne({ id: bookId });
    }

    return collection.findOneAndUpdate(
        { id: bookId },
        { $set: updateData },
        { returnDocument: "after" }
    );
};


export { 
    getAllBooks,
    getBookById,
    postBook,
    putBook
};
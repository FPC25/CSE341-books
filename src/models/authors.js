import { getDb } from "../db/connect.js";

const getAllAuthors = async () => {
    const db = getDb();
    const collection = db.collection("authors");
    const authors = await collection.find({}).toArray();
    return authors;
}

const getAuthorById = async (authorId) => {
    const db = getDb();
    const collection = db.collection("authors");
    const author = await collection.findOne({ "id": authorId });
    return author;
}

export { 
    getAllAuthors,
    getAuthorById
};
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

const getBooksFromAuthor = async (authorId) => {
    const db = getDb();
    const collection = db.collection("books");
    const books = await collection.find({ "authorId": authorId }).toArray();
    return books;
}

const postAuthor = async (authorData) => {
    const db = getDb();
    const collection = db.collection("authors");
    const result = await collection.insertOne(authorData);
    return result;
};

const putAuthor = async (authorId, updateData) => {
    const db = getDb()
    const collection = db.collection("authors");

    if (Object.keys(updateData).length === 0) {
        return collection.findOne({ id: authorId });
    }

    return collection.findOneAndUpdate(
        { id: authorId },
        { $set: updateData },
        { returnDocument: "after" }
    );
};

export { 
    getAllAuthors,
    getAuthorById,
    getBooksFromAuthor,
    postAuthor,
    putAuthor
};
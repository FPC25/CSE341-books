import { 
    getAllAuthors,
    getAuthorById,
    getBooksFromAuthor
} from "../models/authors.js";

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

export { 
    getAuthorsHandler,
    getAuthorByIdHandler,
    getBooksFromAuthorHandler
}
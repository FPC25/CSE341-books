import app from "./app.js";
import { connectToDb } from "./src/db/connect.js";

const PORT = process.env.PORT;

if (!PORT) {
    throw new Error("Error: PORT is not defined in the environment variables.");  
}

const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server is running at http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error.message);
        process.exit(1);
    }
};

startServer();
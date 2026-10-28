import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
    throw new Error("Error: PORT is not defined in the environment variables.");  
}

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
});

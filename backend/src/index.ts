import app from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 4000;

// start server and listen for requests
const startServer = async () => {
    // connect to PostgreSQL first
    await connectDB();

    // start server
app.listen(PORT, () => {
    console.log(`Soul Link API is running on http://localhost:${PORT}`);
  });
};

startServer(); 
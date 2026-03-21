import "dotenv/config";
import pg from "pg";

const  { Pool } = pg;

// this pool is the shared connection manager for your whole app

export const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});

// quick test so the server fails early if DB is broken

export const connectDB = async () => {
    try  {
        const client = await pool.connect();
        console.log("PostgreSQL connected");
        client.release();
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
};
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const host = process.env.PGHOST || "db";
const port = Number(process.env.PGPORT) || 5432;
const database = process.env.PGDATABASE || "soul_link";
const user = process.env.PGUSER || "postgres";
const password = process.env.PGPASSWORD || "postgres";

export const pool = new Pool({
  host,
  port,
  database,
  user,
  password,
});

console.log("PG CONNECTION:", {
  host,
  port,
  database,
  user,
});

pool
  .query(`SELECT current_database() AS db, current_schema() AS schema`)
  .then((result) => {
    console.log("POOL DB CHECK:", result.rows[0]);
  })
  .catch((err) => {
    console.error("POOL DB CHECK FAILED:", err);
  });

pool
  .query(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name = 'users'
  `)
  .then((result) => {
    console.log("POOL USERS CHECK:", result.rows);
  })
  .catch((err) => {
    console.error("POOL USERS CHECK FAILED:", err);
  });

export const connectDB = async () => {
  let retries = 10;

  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log("PostgreSQL connected");
      client.release();
      return;
    } catch (error) {
      retries--;
      console.error("DB connection failed, retrying...", error);

      if (retries === 0) {
        console.error("Could not connect to PostgreSQL after retries.");
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};
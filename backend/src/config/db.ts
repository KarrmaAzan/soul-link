import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

function createPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });
  }

  const host = process.env.PGHOST || "localhost";
  const port = Number(process.env.PGPORT) || 5432;
  const database = process.env.PGDATABASE || "soul_link";
  const user = process.env.PGUSER || "postgres";
  const password = process.env.PGPASSWORD || "postgres";

  console.log("PG CONNECTION:", {
    host,
    port,
    database,
    user,
  });

  return new Pool({
    host,
    port,
    database,
    user,
    password,
    ssl: false,
  });
}

export const pool = createPool();

export const connectDB = async () => {
  let retries = process.env.NODE_ENV === "production" ? 3 : 10;

  while (retries > 0) {
    try {
      const client = await pool.connect();

      const result = await client.query(
        `SELECT current_database() AS db, current_schema() AS schema`
      );

      console.log("PostgreSQL connected:", result.rows[0]);

      client.release();
      return;
    } catch (error) {
      retries--;
      console.error("DB connection failed, retrying...", error);

      if (retries === 0) {
        console.error("Could not connect to PostgreSQL after retries.");
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};
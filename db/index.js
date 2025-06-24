// // db/index.js
// import { Pool } from "pg";
// import dotenv from "dotenv";
// dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER || process.env.DATABASE_URL,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// export default pool;

import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : false,
});

// Test the database connection on startup
pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT NOW()")
      .then((res) => {
        console.log("✅ Connected to PostgreSQL at:", res.rows[0].now);
        client.release();
      })
      .catch((err) => {
        client.release();
        console.error("❌ Error running test query:", err.stack);
      });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.stack);
  });

export default pool;

import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv"; // Updated to use import

dotenv.config(); // Use dotenv to load environment variables

// PostgreSQL connection pool
export const pool = new Pool({
    connectionString: process.env.DATABASE_URLO,
    ssl: {
        rejectUnauthorized: false, // Required for Neon
    },
});

// Test connection
(async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to Old Neon PostgreSQL database!");
        client.release();
    } catch (err) {
        console.error("Old Database connection error:", err);
    }
})();

// PostgreSQL connection pool
export const pool1 = new Pool({
    connectionString: process.env.DATABASE_URL1,
    ssl: {
        rejectUnauthorized: false, // Required for Neon
    },
});

// Test connection
(async () => {
    try {
        const client = await pool1.connect();
        console.log("Connected to New Neon PostgreSQL database!");
        client.release();
    } catch (err) {
        console.error("New Database connection error:", err);
    }
})();
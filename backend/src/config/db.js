
const { Pool } = require("pg");
require("dotenv").config();

console.log("DATABASE_URI:", process.env.DATABASE_URI); // Debugging log

if (!process.env.DATABASE_URI) {
console.error("❌ DATABASE_URI is not set! Check your .env file.");
process.exit(1);
}

const pool = new Pool({
connectionString: process.env.DATABASE_URI,
ssl: { rejectUnauthorized: false }, // Required for Railway
});

pool.on("connect", () => {
console.log("✅ Connected to PostgreSQL on Supabase");
});

pool.on("error", (err) => {
console.error("❌ Database connection error:", err);
});


module.exports = pool;
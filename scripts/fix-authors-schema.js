require("dotenv").config({ path: ".env.local" });
const postgres = require("postgres");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString);

async function run() {
  try {
    console.log("Dropping NOT NULL and UNIQUE constraints on authors.user_id...");
    await sql`ALTER TABLE authors ALTER COLUMN user_id DROP NOT NULL;`;
    await sql`ALTER TABLE authors DROP CONSTRAINT IF EXISTS authors_user_id_key;`;
    await sql`ALTER TABLE authors DROP CONSTRAINT IF EXISTS authors_user_id_unique;`;
    console.log("Successfully updated authors table constraints!");
  } catch (err) {
    console.error("Error altering authors table:", err);
  } finally {
    await sql.end();
  }
}

run();

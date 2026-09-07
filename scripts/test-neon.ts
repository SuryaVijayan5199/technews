import { neon } from "@neondatabase/serverless";

async function run() {
  const url = "postgresql://neondb_owner:npg_HSCF6LkV0eAX@ep-wild-butterfly-azhaalkx.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(url);
  const res = await sql`SELECT count(*) FROM articles`;
  console.log("NEON ARTICLES COUNT:", res);
  process.exit(0);
}
run();

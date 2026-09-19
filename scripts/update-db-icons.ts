import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

async function main() {
  console.log("Updating database category icons to use /icons/techcrest-icon.svg...");
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql, { schema });

  const cats = await db.select().from(schema.categories);
  console.log(`Found ${cats.length} categories in database.`);

  for (const cat of cats) {
    await db
      .update(schema.categories)
      .set({ icon: "/icons/techcrest-icon.svg", updatedAt: new Date() })
      .where(eq(schema.categories.id, cat.id));
    console.log(`Updated category ID ${cat.id} (${cat.name}) icon to /icons/techcrest-icon.svg`);
  }

  console.log("Database update complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to update database icons:", err);
  process.exit(1);
});

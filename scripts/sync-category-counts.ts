import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, count } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function main() {
  console.log("🔄 Syncing category article counts in database...");

  const allCats = await db.query.categories.findMany();
  const articleCounts = await db
    .select({
      categoryId: schema.articles.categoryId,
      count: count(schema.articles.id),
    })
    .from(schema.articles)
    .groupBy(schema.articles.categoryId);

  const countMap = new Map<number, number>();
  for (const item of articleCounts) {
    if (item.categoryId) {
      countMap.set(item.categoryId, Number(item.count));
    }
  }

  for (const cat of allCats) {
    const realCount = countMap.get(cat.id) ?? 0;
    await db
      .update(schema.categories)
      .set({ articleCount: realCount })
      .where(eq(schema.categories.id, cat.id));
    console.log(`✅ Category "${cat.name}" (/${cat.slug}): ${realCount} articles`);
  }

  console.log("🎉 Category article counts successfully synced!");
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});

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
  console.log("🔄 Removing 'Newsletters' category & updating 10 active categories...");

  // 1. Mark 'newsletters' category as inactive or delete if existing
  const newsletterCat = await db.query.categories.findFirst({
    where: eq(schema.categories.slug, "newsletters"),
  });

  if (newsletterCat) {
    // Delete any articles under newsletters or set category inactive
    await db.update(schema.articles)
      .set({ categoryId: null })
      .where(eq(schema.articles.categoryId, newsletterCat.id));

    await db.delete(schema.categories)
      .where(eq(schema.categories.id, newsletterCat.id));

    console.log("✅ Removed 'newsletters' category from DB.");
  }

  // 2. Define the 10 official topics & update sort order
  const activeTopics = [
    { slug: "news", sortOrder: 1 },
    { slug: "phone", sortOrder: 2 },
    { slug: "audio", sortOrder: 3 },
    { slug: "robotics", sortOrder: 4 },
    { slug: "fitness", sortOrder: 5 },
    { slug: "security", sortOrder: 6 },
    { slug: "ai", sortOrder: 7 },
    { slug: "smart-home", sortOrder: 8 },
    { slug: "evs", sortOrder: 9 },
    { slug: "crypto", sortOrder: 10 },
  ];

  for (const topic of activeTopics) {
    await db
      .update(schema.categories)
      .set({ sortOrder: topic.sortOrder, isActive: true })
      .where(eq(schema.categories.slug, topic.slug));
  }

  // 3. Sync article counts for remaining 10 categories
  const allCats = await db.query.categories.findMany({
    where: eq(schema.categories.isActive, true),
  });

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
    console.log(`📌 Category #${cat.sortOrder} "${cat.name}" (/${cat.slug}): ${realCount} articles`);
  }

  console.log("🎉 Successfully updated DB to 10 active categories!");
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});

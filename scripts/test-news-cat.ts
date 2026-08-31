import { config } from "dotenv";
config({ path: ".env.local" });

async function run() {
  const { db } = await import("../lib/db");
  const { getArticlesByCategory } = await import("../lib/actions/article.actions");

  const allCats = await db.query.categories.findMany();
  console.log("DB categories count:", allCats.length);
  allCats.forEach(c => console.log(`ID: ${c.id}, Name: ${c.name}, Slug: "${c.slug}"`));

  const res = await getArticlesByCategory("news");
  console.log("getArticlesByCategory('news') -> category name:", res.category?.name ?? "NOT FOUND");
  process.exit(0);
}
run();
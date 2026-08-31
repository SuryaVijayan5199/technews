import { config } from "dotenv";
config({ path: ".env.local" });

async function run() {
  const { db } = await import("../lib/db");
  const arts = await db.query.articles.findMany({ with: { category: true } });
  console.log("ARTICLES IN DB & FLAGS:");
  arts.forEach(a => {
    console.log(`ID: ${a.id} | Title: "${a.title}" | Status: ${a.status} | Breaking: ${a.isBreaking} | Featured: ${a.isFeatured} | Editors: ${a.isEditorsPick} | Trending: ${a.isTrending} | Cat: ${a.category?.name}`);
  });
  process.exit(0);
}
run();
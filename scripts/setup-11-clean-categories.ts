import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

const STANDARD_CATEGORIES = [
  { name: "News",        slug: "news",        description: "Latest technology news from around the world", icon: "Newspaper", color: "#2D7FF9", sortOrder: 1 },
  { name: "Phone",       slug: "phone",       description: "Smartphones, reviews, and mobile news",         icon: "Smartphone",color: "#0ea5e9", sortOrder: 2 },
  { name: "Audio",       slug: "audio",       description: "Headphones, speakers, and audio gear",          icon: "Headphones",color: "#8b5cf6", sortOrder: 3 },
  { name: "Robotic",     slug: "robotics",    description: "Robotics, automation, and AI hardware",        icon: "Bot",       color: "#6366f1", sortOrder: 4 },
  { name: "Fitness",     slug: "fitness",     description: "Wearables, health tech, and fitness gadgets",   icon: "Activity",  color: "#10b981", sortOrder: 5 },
  { name: "Security",    slug: "security",    description: "Cybersecurity, privacy, and data protection",    icon: "Shield",    color: "#f59e0b", sortOrder: 6 },
  { name: "Newsletters", slug: "newsletters", description: "Curated briefings delivered to your inbox",    icon: "Mail",      color: "#ec4899", sortOrder: 7 },
  { name: "AI",          slug: "ai",          description: "Artificial intelligence, LLMs, and machine learning", icon: "Brain", color: "#a855f7", sortOrder: 8 },
  { name: "Home",        slug: "smart-home",  description: "Smart home devices, hubs, and automation",    icon: "Home",      color: "#14b8a6", sortOrder: 9 },
  { name: "EVs",         slug: "evs",         description: "Electric vehicles, charging, and future mobility", icon: "Zap",    color: "#22c55e", sortOrder: 10 },
  { name: "Crypto",      slug: "crypto",      description: "Cryptocurrency, blockchain, and Web3",         icon: "Bitcoin",   color: "#f97316", sortOrder: 11 },
];

async function main() {
  console.log("🛠️  Setting up clean 11 categories...");

  // Fetch articles to preserve titles and map them back later
  const existingArticles = await db.query.articles.findMany({ with: { category: true } });

  // Unlink articles from categories temporarily
  await sql`UPDATE articles SET category_id = NULL`;
  await sql`UPDATE categories SET parent_id = NULL`;
  await db.delete(schema.categories);
  console.log("  ✓ Cleared old category table");

  const catMap = new Map<string, number>();

  for (const catDef of STANDARD_CATEGORIES) {
    const [inserted] = await db.insert(schema.categories).values({
      name: catDef.name,
      slug: catDef.slug,
      description: catDef.description,
      icon: catDef.icon,
      color: catDef.color,
      sortOrder: catDef.sortOrder,
      isActive: true,
    }).returning();
    catMap.set(catDef.slug, inserted.id);
    console.log(`  ✅ Category: ${catDef.name} -> /${catDef.slug} (id: ${inserted.id})`);
  }

  // Re-link existing user articles to matching main category
  for (const article of existingArticles) {
    let targetSlug = "news";
    const oldSlug = (article.category?.slug || "").toLowerCase();
    const title = article.title.toLowerCase();

    if (oldSlug.includes("cyber") || oldSlug.includes("security") || title.includes("cyber") || title.includes("security")) {
      targetSlug = "security";
    } else if (oldSlug.includes("phone") || oldSlug.includes("mobile") || title.includes("phone") || title.includes("mobile")) {
      targetSlug = "phone";
    } else if (oldSlug.includes("audio") || oldSlug.includes("headphone") || title.includes("audio")) {
      targetSlug = "audio";
    } else if (oldSlug.includes("robot") || title.includes("robot")) {
      targetSlug = "robotics";
    } else if (oldSlug.includes("fit") || oldSlug.includes("watch") || title.includes("fit")) {
      targetSlug = "fitness";
    } else if (oldSlug.includes("ai") || title.includes("ai") || title.includes("gpt")) {
      targetSlug = "ai";
    } else if (oldSlug.includes("home") || title.includes("home")) {
      targetSlug = "smart-home";
    } else if (oldSlug.includes("ev") || title.includes("ev") || title.includes("tesla")) {
      targetSlug = "evs";
    } else if (oldSlug.includes("crypto") || title.includes("crypto") || title.includes("bitcoin")) {
      targetSlug = "crypto";
    }

    const catId = catMap.get(targetSlug)!;
    await db.update(schema.articles).set({ categoryId: catId }).where(eq(schema.articles.id, article.id));
    console.log(`  🔗 Re-linked "${article.title}" -> /${targetSlug}`);
  }

  console.log("\n✨ Done! Database now has exactly the 11 single categories.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
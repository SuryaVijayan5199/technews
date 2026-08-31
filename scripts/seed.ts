import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import { eq } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding started...");

  try {
    // 1. Check if we already seeded to avoid duplicates
    const existingCat = await db.query.categories.findFirst({
      where: eq(schema.categories.slug, "ai")
    });

    if (existingCat) {
      console.log("Database already seeded. Aborting.");
      process.exit(0);
    }

    // 2. Insert Category
    const [category] = await db.insert(schema.categories).values({
      name: "AI & Future",
      slug: "ai",
      description: "Artificial intelligence news and guides",
      isActive: true,
      articleCount: 1,
    }).returning();
    console.log("Category created:", category.name);

    // 3. Insert User & Author
    const [user] = await db.insert(schema.users).values({
      email: "test@technews.com",
      name: "John Editor",
      role: "editor",
    }).returning();

    const [author] = await db.insert(schema.authors).values({
      userId: user.id,
      slug: "john-editor",
      displayName: "John Editor",
      bio: "Tech enthusiast and editor.",
      articleCount: 1,
    }).returning();
    console.log("Author created:", author.displayName);

    // 4. Insert Article
    const [article] = await db.insert(schema.articles).values({
      title: "Welcome to TechNews: Your First Dynamic Article",
      slug: "welcome-to-technews",
      excerpt: "This is a seeded article fetched directly from Neon Postgres.",
      contentHtml: "<p>The dashboard is now reading directly from the database!</p>",
      status: "published",
      categoryId: category.id,
      authorId: author.id,
      viewCount: 1250,
      publishedAt: new Date(),
    }).returning();
    console.log("Article created:", article.title);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();

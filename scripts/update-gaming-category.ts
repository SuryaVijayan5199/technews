import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, or } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function main() {
  console.log("🎮 Updating database: Replacing Reviews with Gaming category...");

  // 1. Check if 'reviews' or 'gaming' category exists
  let gamingCat = await db.query.categories.findFirst({
    where: or(eq(schema.categories.slug, "gaming"), eq(schema.categories.slug, "reviews")),
  });

  if (gamingCat) {
    // Update existing category to Gaming
    const [updated] = await db
      .update(schema.categories)
      .set({
        name: "Gaming",
        slug: "gaming",
        description: "Video games, consoles, PC gaming, hardware, and esports",
        icon: "Gamepad2",
        color: "#ef4444",
        isActive: true,
      })
      .where(eq(schema.categories.id, gamingCat.id))
      .returning();
    gamingCat = updated;
    console.log(`  ✅ Updated category (ID: ${gamingCat.id}) -> Gaming (/gaming)`);
  } else {
    // Insert new Gaming category
    const [inserted] = await db
      .insert(schema.categories)
      .values({
        name: "Gaming",
        slug: "gaming",
        description: "Video games, consoles, PC gaming, hardware, and esports",
        icon: "Gamepad2",
        color: "#ef4444",
        sortOrder: 10,
        isActive: true,
      })
      .returning();
    gamingCat = inserted;
    console.log(`  ✅ Created new Gaming category (ID: ${gamingCat.id})`);
  }

  // 2. Fetch an author ID for seeding articles
  const author = await db.query.authors.findFirst();
  const authorId = author ? author.id : 1;

  // 3. Create 3 dedicated Gaming articles
  const gamingArticles = [
    {
      title: "PS5 Pro vs High-End Gaming PC: 4K Performance & Ray Tracing Comparison",
      slug: "ps5-pro-vs-gaming-pc-performance-comparison",
      excerpt: "We pit Sony's upgraded console hardware against custom PC builds across modern AAA titles to see which delivers better 4K ray tracing.",
      content: "<p>The battle for 4K gaming supremacy has reached a new peak. With Sony's PS5 Pro offering dedicated AI upscaling and enhanced ray tracing architecture, console gamers have never had a more compelling argument against expensive desktop rigs.</p><p>In our comprehensive benchmark testing across ten modern AAA titles, we analyzed frame pacing, 1% low framerates, and thermal power draw to determine which platform offers the true ultra-high-definition experience.</p>",
      heroImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 18500,
      isFeatured: true,
      isEditorsPick: true,
      isTrending: true,
    },
    {
      title: "Next-Gen Graphics Engines Redefine Real-Time Neural Rendering in Games",
      slug: "next-gen-graphics-engines-neural-rendering",
      excerpt: "Unreal Engine 5.5 and machine learning upscalers bring cinematic photorealism to interactive gaming worlds.",
      content: "<p>Real-time graphics pipeline design is undergoing its most radical transformation in decades. By integrating neural radiance fields (NeRFs) and AI-assisted geometry reconstruction, game studios are rendering environments that were previously impossible outside of offline film renders.</p><p>We examine how hardware path tracing and neural supersampling allow game engines to compute complex reflections and global illumination with minimal latency.</p>",
      heroImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 14200,
      isFeatured: false,
      isEditorsPick: true,
      isTrending: false,
    },
    {
      title: "Handheld Gaming Consoles Surge: OLED Displays & Custom APU Battery Benchmarks",
      slug: "handheld-gaming-consoles-oled-battery-benchmarks",
      excerpt: "Portable PC gaming handhelds reshape consumer play habits with major energy efficiency breakthroughs.",
      content: "<p>Portable gaming PCs have evolved from niche enthusiast hardware into mainstream computing devices. Thanks to 4nm system-on-chip designs and low-voltage OLED panels, modern handhelds deliver 60 FPS AAA gameplay on battery power.</p><p>Our battery strain test subjects the top portable gaming devices to continuous high-wattage gaming loads to measure real-world endurance and ergonomics.</p>",
      heroImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 11900,
      isFeatured: false,
      isEditorsPick: false,
      isTrending: true,
    },
  ];

  for (const artData of gamingArticles) {
    const existing = await db.query.articles.findFirst({
      where: eq(schema.articles.slug, artData.slug),
    });

    if (existing) {
      await db
        .update(schema.articles)
        .set({
          title: artData.title,
          excerpt: artData.excerpt,
          content: artData.content,
          heroImage: artData.heroImage,
          readingTimeMinutes: artData.readingTimeMinutes,
          categoryId: gamingCat.id,
          status: "published",
          publishedAt: new Date(),
        })
        .where(eq(schema.articles.id, existing.id));
      console.log(`  🔄 Updated article: "${artData.title}"`);
    } else {
      await db.insert(schema.articles).values({
        title: artData.title,
        slug: artData.slug,
        excerpt: artData.excerpt,
        content: artData.content,
        heroImage: artData.heroImage,
        readingTimeMinutes: artData.readingTimeMinutes,
        viewCount: artData.viewCount,
        isFeatured: artData.isFeatured,
        isEditorsPick: artData.isEditorsPick,
        isTrending: artData.isTrending,
        status: "published",
        publishedAt: new Date(),
        categoryId: gamingCat.id,
        authorId: authorId,
      });
      console.log(`  ✨ Inserted article: "${artData.title}"`);
    }
  }

  // Also update any existing articles that were linked to old reviews category to belong to Gaming
  await db
    .update(schema.articles)
    .set({ categoryId: gamingCat.id })
    .where(eq(schema.articles.categoryId, gamingCat.id));

  console.log("\n🎉 Database updated successfully with Gaming category and articles!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed to update database:", err);
  process.exit(1);
});

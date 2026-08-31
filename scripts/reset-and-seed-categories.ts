/**
 * TechCrest — Reset & Category Seed Script
 * Clears all existing articles, tags, categories
 * then inserts all 11 nav categories + subcategories.
 *
 * Run: npx tsx scripts/reset-and-seed-categories.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { isNull, isNotNull } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) throw new Error("DATABASE_URL not set in .env.local");

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

// ─────────────────────────────────────────────────────────
// Category data — 11 parent + subcategories
// ─────────────────────────────────────────────────────────
interface CatDef {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  children: { name: string; slug: string; description: string; icon: string }[];
}

const CATEGORIES: CatDef[] = [
  {
    name: "News",
    slug: "news",
    description: "Latest technology news from around the world",
    icon: "Newspaper",
    color: "#2D7FF9",
    sortOrder: 1,
    children: [
      { name: "Breaking News",       slug: "breaking-news",       description: "The latest breaking technology stories", icon: "Zap" },
      { name: "Analysis",            slug: "analysis",            description: "In-depth analysis of technology trends",  icon: "BarChart2" },
      { name: "Opinion & Editorial", slug: "opinion",             description: "Expert opinions and editorials",          icon: "MessageSquare" },
      { name: "Science & Space",     slug: "science",             description: "Science and space exploration news",      icon: "Telescope" },
      { name: "Startups",            slug: "startups",            description: "Startup ecosystem news and funding",      icon: "Rocket" },
      { name: "Business & Markets",  slug: "business",            description: "Technology business and market news",     icon: "TrendingUp" },
    ],
  },
  {
    name: "Phone",
    slug: "phone",
    description: "Smartphones, reviews, and mobile news",
    icon: "Smartphone",
    color: "#0ea5e9",
    sortOrder: 2,
    children: [
      { name: "Smartphone Reviews",  slug: "phone-reviews",       description: "In-depth smartphone reviews",            icon: "Smartphone" },
      { name: "Android",             slug: "android",             description: "Android phones, apps and updates",       icon: "Smartphone" },
      { name: "iPhone & iOS",        slug: "iphone",              description: "iPhone and iOS ecosystem news",          icon: "Smartphone" },
      { name: "Mobile Apps",         slug: "mobile-apps",         description: "Best mobile apps and app news",          icon: "Grid" },
      { name: "Accessories",         slug: "phone-accessories",   description: "Phone cases, chargers, and accessories", icon: "Plug" },
    ],
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Headphones, speakers, and audio gear",
    icon: "Headphones",
    color: "#8b5cf6",
    sortOrder: 3,
    children: [
      { name: "Headphones",          slug: "headphones",          description: "Over-ear and on-ear headphone reviews",  icon: "Headphones" },
      { name: "Earbuds & TWS",       slug: "earbuds",             description: "True wireless earbuds reviews",          icon: "Headphones" },
      { name: "Speakers",            slug: "speakers",            description: "Bluetooth and home speakers",            icon: "Volume2" },
      { name: "Hi-Fi & Audiophile",  slug: "hifi",                description: "High-fidelity audio equipment",          icon: "Music" },
      { name: "Podcasts",            slug: "podcasts",            description: "Tech podcasts and audio shows",          icon: "Mic" },
    ],
  },
  {
    name: "Robotic",
    slug: "robotics",
    description: "Robotics, automation, and AI hardware",
    icon: "Bot",
    color: "#6366f1",
    sortOrder: 4,
    children: [
      { name: "Humanoid Robots",        slug: "humanoid-robots",     description: "Humanoid robot development and news",    icon: "Bot" },
      { name: "Industrial Automation",  slug: "industrial-automation",description: "Factory and industrial robotics",        icon: "Cpu" },
      { name: "Drone Technology",       slug: "drones",              description: "Drones, UAVs and aerial tech",           icon: "Wind" },
      { name: "AI Hardware",            slug: "ai-hardware",         description: "AI chips, GPUs and hardware news",       icon: "Cpu" },
      { name: "Research & Labs",        slug: "robotics-research",   description: "Robotics research and lab breakthroughs",icon: "FlaskConical" },
    ],
  },
  {
    name: "Fitness",
    slug: "fitness",
    description: "Wearables, health tech, and fitness gadgets",
    icon: "Activity",
    color: "#10b981",
    sortOrder: 5,
    children: [
      { name: "Smartwatches",        slug: "smartwatches",        description: "Smartwatch reviews and news",            icon: "Watch" },
      { name: "Fitness Trackers",    slug: "fitness-trackers",    description: "Activity and fitness tracker reviews",   icon: "Activity" },
      { name: "Health Apps",         slug: "health-apps",         description: "Health and wellness app reviews",        icon: "Heart" },
      { name: "Sports Tech",         slug: "sports-tech",         description: "Technology for sports and athletes",     icon: "Dumbbell" },
    ],
  },
  {
    name: "Security",
    slug: "security",
    description: "Cybersecurity, privacy, and data protection",
    icon: "Shield",
    color: "#f59e0b",
    sortOrder: 6,
    children: [
      { name: "Cybersecurity News",  slug: "cybersecurity",       description: "Latest cybersecurity threats and news",  icon: "Shield" },
      { name: "Privacy & Data",      slug: "privacy",             description: "Data privacy and protection news",       icon: "Lock" },
      { name: "Enterprise Security", slug: "enterprise-security", description: "Enterprise and corporate security",      icon: "Building2" },
      { name: "Hacking & Exploits",  slug: "hacking",             description: "Vulnerability and exploit disclosures",  icon: "AlertTriangle" },
      { name: "VPN & Tools",         slug: "vpn-tools",           description: "VPN, security tools and software",      icon: "Wifi" },
    ],
  },
  {
    name: "Newsletters",
    slug: "newsletters",
    description: "Curated tech briefings delivered to your inbox",
    icon: "Mail",
    color: "#ec4899",
    sortOrder: 7,
    children: [
      { name: "Daily Briefing",      slug: "daily-briefing",      description: "Your daily technology summary",          icon: "Mail" },
      { name: "AI Weekly",           slug: "ai-weekly",           description: "Weekly AI and machine learning digest",  icon: "Brain" },
      { name: "Security Digest",     slug: "security-digest",     description: "Weekly cybersecurity digest",            icon: "Shield" },
      { name: "EV & Future Mobility",slug: "ev-newsletter",       description: "Electric vehicle weekly newsletter",     icon: "Zap" },
      { name: "Crypto Weekly",       slug: "crypto-weekly",       description: "Weekly crypto and Web3 digest",          icon: "Bitcoin" },
    ],
  },
  {
    name: "AI",
    slug: "ai",
    description: "Artificial intelligence, LLMs, and machine learning",
    icon: "Brain",
    color: "#a855f7",
    sortOrder: 8,
    children: [
      { name: "AI Models & LLMs",    slug: "ai-models",           description: "Large language models and AI models",    icon: "Brain" },
      { name: "AI Agents",           slug: "ai-agents",           description: "AI agent frameworks and deployments",    icon: "Bot" },
      { name: "Generative AI",       slug: "generative-ai",       description: "Generative AI tools and creativity",     icon: "Sparkles" },
      { name: "AI in Business",      slug: "ai-business",         description: "Enterprise AI adoption and strategy",    icon: "TrendingUp" },
      { name: "Research & Papers",   slug: "ai-research",         description: "AI research papers and breakthroughs",   icon: "BookOpen" },
      { name: "AI Tools",            slug: "ai-tools",            description: "Practical AI tools and productivity",    icon: "Wrench" },
    ],
  },
  {
    name: "Home",
    slug: "smart-home",
    description: "Smart home devices, hubs, and automation",
    icon: "Home",
    color: "#14b8a6",
    sortOrder: 9,
    children: [
      { name: "Smart Speakers",      slug: "smart-speakers",      description: "Smart speakers and voice assistants",    icon: "Speaker" },
      { name: "Smart Displays",      slug: "smart-displays",      description: "Smart displays and hubs",               icon: "Monitor" },
      { name: "Security Cameras",    slug: "home-cameras",        description: "Home security cameras and doorbells",    icon: "Camera" },
      { name: "Smart Lighting",      slug: "smart-lighting",      description: "Smart bulbs, strips and lighting",       icon: "Lightbulb" },
      { name: "Home Automation",     slug: "home-automation",     description: "Home automation systems and hubs",       icon: "Home" },
    ],
  },
  {
    name: "EVs",
    slug: "evs",
    description: "Electric vehicles, charging, and future mobility",
    icon: "Zap",
    color: "#22c55e",
    sortOrder: 10,
    children: [
      { name: "EV News",             slug: "ev-news",             description: "Latest electric vehicle news",           icon: "Zap" },
      { name: "EV Reviews",          slug: "ev-reviews",          description: "Electric vehicle reviews and tests",     icon: "Car" },
      { name: "Charging & Infrastructure", slug: "ev-charging",   description: "EV charging networks and infrastructure",icon: "BatteryCharging" },
      { name: "Tesla",               slug: "tesla",               description: "Tesla news, reviews and updates",        icon: "Zap" },
      { name: "Future Mobility",     slug: "future-mobility",     description: "Autonomous vehicles and future transport",icon: "TrendingUp" },
    ],
  },
  {
    name: "Crypto",
    slug: "crypto",
    description: "Cryptocurrency, blockchain, and Web3",
    icon: "Bitcoin",
    color: "#f97316",
    sortOrder: 11,
    children: [
      { name: "Crypto News",         slug: "crypto-news",         description: "Latest cryptocurrency news",             icon: "TrendingUp" },
      { name: "Bitcoin & Ethereum",  slug: "bitcoin",             description: "Bitcoin, Ethereum and major coins",      icon: "Bitcoin" },
      { name: "Web3 & DeFi",         slug: "web3",                description: "Decentralized finance and Web3",         icon: "Globe" },
      { name: "NFTs",                slug: "nfts",                description: "NFT news, drops and marketplace",        icon: "Image" },
      { name: "Blockchain Tech",     slug: "blockchain",          description: "Blockchain technology and protocols",     icon: "Link" },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────
async function main() {
  console.log("\n🗑️  Step 1: Clearing existing data...\n");

  // Delete in FK-safe order
  await db.delete(schema.articleTags);
  console.log("  ✓ Cleared article_tags");

  await db.delete(schema.reviews);
  console.log("  ✓ Cleared reviews");

  await db.delete(schema.buyingGuides);
  console.log("  ✓ Cleared buying_guides");

  await db.delete(schema.comments);
  console.log("  ✓ Cleared comments");

  await db.delete(schema.bookmarks);
  console.log("  ✓ Cleared bookmarks");

  await db.delete(schema.readingHistory);
  console.log("  ✓ Cleared reading_history");

  await db.delete(schema.affiliateLinks);
  console.log("  ✓ Cleared affiliate_links");

  await db.delete(schema.trendingArticles);
  console.log("  ✓ Cleared trending_articles");

  await db.delete(schema.analyticsEvents);
  console.log("  ✓ Cleared analytics_events");

  await db.delete(schema.articles);
  console.log("  ✓ Cleared articles");

  await db.delete(schema.tags);
  console.log("  ✓ Cleared tags");

  // Clear subcategories (children) first, then parents (self-ref FK)
  await sql`UPDATE categories SET parent_id = NULL WHERE parent_id IS NOT NULL`;
  await db.delete(schema.categories);
  console.log("  ✓ Cleared categories\n");

  // ── Insert categories ──
  console.log("🌱 Step 2: Seeding categories & subcategories...\n");

  let totalSubcats = 0;

  for (const cat of CATEGORIES) {
    // Insert parent category
    const [parent] = await db
      .insert(schema.categories)
      .values({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        sortOrder: cat.sortOrder,
        isActive: true,
        articleCount: 0,
      })
      .returning();

    console.log(`  ✅ ${cat.name} (id: ${parent.id})`);

    // Insert subcategories
    for (let i = 0; i < cat.children.length; i++) {
      const child = cat.children[i];
      await db.insert(schema.categories).values({
        name: child.name,
        slug: child.slug,
        description: child.description,
        icon: child.icon,
        color: cat.color,          // inherit parent color
        parentId: parent.id,
        sortOrder: i + 1,
        isActive: true,
        articleCount: 0,
      });
      console.log(`      └─ ${child.name}`);
      totalSubcats++;
    }
  }

  // ── Insert common tags ──
  console.log("\n🏷️  Step 3: Seeding common tags...\n");

  const TAGS = [
    { name: "Breaking", slug: "breaking" },
    { name: "AI", slug: "tag-ai" },
    { name: "Review", slug: "review" },
    { name: "Exclusive", slug: "exclusive" },
    { name: "Opinion", slug: "opinion-tag" },
    { name: "Analysis", slug: "analysis-tag" },
    { name: "Guide", slug: "guide" },
    { name: "Security", slug: "tag-security" },
    { name: "Privacy", slug: "privacy" },
    { name: "Mobile", slug: "mobile" },
    { name: "EV", slug: "ev" },
    { name: "Crypto", slug: "crypto-tag" },
    { name: "Robotics", slug: "robotics-tag" },
    { name: "Wearables", slug: "wearables" },
    { name: "Smart Home", slug: "smart-home-tag" },
  ];

  for (const tag of TAGS) {
    try {
      await db.insert(schema.tags).values(tag);
      console.log(`  🏷️  ${tag.name}`);
    } catch {
      console.log(`  ⚠️  Skipping tag "${tag.name}" (may already exist)`);
    }
  }

  console.log(`
✨ Done!
   • 11 parent categories
   • ${totalSubcats} subcategories
   • ${TAGS.length} common tags
   • All articles and old categories cleared

Editors can now write articles and assign them to any category in the dashboard.
`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

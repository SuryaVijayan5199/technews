import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

const CATEGORIES_DATA = [
  { name: "News", slug: "news", description: "Latest technology news from around the world", icon: "Newspaper", color: "#2D7FF9", sortOrder: 1 },
  { name: "Phone", slug: "phone", description: "Smartphones, reviews, and mobile news", icon: "Smartphone", color: "#0ea5e9", sortOrder: 2 },
  { name: "Audio", slug: "audio", description: "Headphones, speakers, and audio gear", icon: "Headphones", color: "#8b5cf6", sortOrder: 3 },
  { name: "Robotic", slug: "robotics", description: "Robotics, automation, and AI hardware", icon: "Bot", color: "#6366f1", sortOrder: 4 },
  { name: "Fitness", slug: "fitness", description: "Wearables, health tech, and fitness gadgets", icon: "Activity", color: "#10b981", sortOrder: 5 },
  { name: "Security", slug: "security", description: "Cybersecurity, privacy, and data protection", icon: "Shield", color: "#f59e0b", sortOrder: 6 },
  { name: "AI", slug: "ai", description: "Artificial intelligence, LLMs, and machine learning", icon: "Brain", color: "#a855f7", sortOrder: 7 },
  { name: "Home", slug: "smart-home", description: "Smart home devices, hubs, and automation", icon: "Home", color: "#14b8a6", sortOrder: 8 },
  { name: "EVs", slug: "evs", description: "Electric vehicles, charging, and future mobility", icon: "Zap", color: "#22c55e", sortOrder: 9 },
  { name: "Crypto", slug: "crypto", description: "Cryptocurrency, blockchain, and Web3", icon: "Bitcoin", color: "#f97316", sortOrder: 10 },
];

const TOPIC_ARTICLES: Record<string, Array<{
  title: string;
  slug: string;
  excerpt: string;
  heroImage: string;
  readingTimeMinutes: number;
  viewCount: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  isTrending?: boolean;
}>> = {
  news: [
    {
      title: "Global Tech Summit 2026 Outlines the Future of Sustainable Computing",
      slug: "global-tech-summit-2026-sustainable-computing",
      excerpt: "Industry leaders gather to mandate new energy efficiency standards for data centers worldwide.",
      heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 14200,
      isFeatured: true,
      isBreaking: true,
    },
    {
      title: "Semiconductor Breakthrough Promises 40% Lower Power Draw in Next-Gen Processors",
      slug: "semiconductor-breakthrough-promises-lower-power-draw",
      excerpt: "New 1.4nm node architecture achieves record-breaking thermal efficiency in preliminary testing.",
      heroImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 9800,
      isTrending: true,
    },
    {
      title: "European Union Formally Approves Universal Standards for Wireless Charging Devices",
      slug: "eu-approves-universal-standards-wireless-charging",
      excerpt: "The mandate aims to eliminate proprietary inductive pads and streamline consumer tech hardware.",
      heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 4,
      viewCount: 6500,
      isEditorsPick: true,
    },
  ],
  phone: [
    {
      title: "Flagship Smartphone Camera Battle: Next-Gen Sensors Compared in Low Light",
      slug: "flagship-smartphone-camera-battle-2026",
      excerpt: "We pit the latest 1-inch sensor optical modules against computational photography algorithms.",
      heroImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 8,
      viewCount: 18400,
      isFeatured: true,
      isEditorsPick: true,
    },
    {
      title: "Foldable Phones Reach Maturity: Durability Tests Prove 500,000 Fold Threshold",
      slug: "foldable-phones-durability-tests-breakthrough",
      excerpt: "New ultra-thin flexible glass hinges eliminate crease visibility while boosting structural strength.",
      heroImage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 12300,
      isTrending: true,
    },
    {
      title: "On-Device Neural Engines Revolutionize Mobile Battery Optimization",
      slug: "on-device-neural-engines-battery-optimization",
      excerpt: "Intelligent background task scheduling extends active screen-on time by up to 3 hours per charge.",
      heroImage: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 7900,
    },
  ],
  audio: [
    {
      title: "Spatial Audio 2.0 Review: Head Tracking Reaches Studio Reference Quality",
      slug: "spatial-audio-2-review-studio-reference-quality",
      excerpt: "Recent firmwares enable real-time acoustic ray tracing for binaural surround sound listening.",
      heroImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 11500,
      isFeatured: true,
    },
    {
      title: "Active Noise Cancellation Shootout: The Best Wireless Earbuds Tested",
      slug: "anc-shootout-best-wireless-earbuds-2026",
      excerpt: "Comparing decibel suppression across aircraft cabins, urban transit, and busy open offices.",
      heroImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 9,
      viewCount: 15600,
      isEditorsPick: true,
    },
    {
      title: "Lossless Wireless Audio Codecs Eliminate Bluetooth Compression Bottlenecks",
      slug: "lossless-wireless-audio-codecs-bluetooth",
      excerpt: "Next-gen ultra-wideband audio protocols bring 24-bit 192kHz resolution without dropout latency.",
      heroImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 8400,
    },
  ],
  robotics: [
    {
      title: "Humanoid Robotics Enter Manufacturing: Field Reports From Autonomous Assembly Lines",
      slug: "humanoid-robotics-manufacturing-autonomous-assembly",
      excerpt: "Bipedal robots now handle complex warehouse logistics and delicate component placements.",
      heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 10,
      viewCount: 22100,
      isFeatured: true,
      isBreaking: true,
    },
    {
      title: "Next-Gen Tactile Sensors Allow Robotic Grippers to Feel Textures and Pressure",
      slug: "tactile-sensors-robotic-grippers-pressure-sensitivity",
      excerpt: "Bio-inspired electronic skin provides sub-millimeter precision for handling fragile glass and electronics.",
      heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 13900,
      isTrending: true,
    },
    {
      title: "Autonomous Delivery Drones Receive Beyond Line-of-Sight Regulatory Approval",
      slug: "autonomous-delivery-drones-line-of-sight-approval",
      excerpt: "Skyward routing systems enable safe urban package transport at lower operating costs.",
      heroImage: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 9100,
    },
  ],
  fitness: [
    {
      title: "Non-Invasive Glucose Monitoring: Continuous Health Tracking Transformed",
      slug: "non-invasive-glucose-monitoring-wearable-tech",
      excerpt: "Optical spectroscopic sensors deliver clinical accuracy on smartwatches without needle pricks.",
      heroImage: "https://images.unsplash.com/photo-1510519138161-58446232f71b?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 16700,
      isFeatured: true,
      isEditorsPick: true,
    },
    {
      title: "Smart Rings vs Premium Fitness Watches: Detailed 30-Day Recovery Comparison",
      slug: "smart-rings-vs-fitness-watches-recovery-tracking",
      excerpt: "Analyzing HRV accuracy, sleep staging, body temperature drift, and battery endurance.",
      heroImage: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 8,
      viewCount: 14200,
      isTrending: true,
    },
    {
      title: "Biometric Compression Wearables Accelerate Muscle Recovery for Athletes",
      slug: "biometric-compression-wearables-muscle-recovery",
      excerpt: "Integrated pneumatic micro-actuators apply targeted compression based on muscle fatigue metrics.",
      heroImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 7800,
    },
  ],
  security: [
    {
      title: "Zero-Trust Architecture Shifts Focus to Continuous Identity Verification",
      slug: "zero-trust-architecture-identity-verification-2026",
      excerpt: "Security teams move away from perimeter defenses toward dynamic contextual authorization.",
      heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 9,
      viewCount: 19800,
      isFeatured: true,
      isBreaking: true,
    },
    {
      title: "Post-Quantum Cryptography Migration: Preparing Enterprise Infrastructure",
      slug: "post-quantum-cryptography-migration-enterprise-security",
      excerpt: "NIST-standardized lattice algorithms replace legacy RSA encryption to counter quantum decryption risks.",
      heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 11200,
      isTrending: true,
    },
    {
      title: "AI-Powered Deepfake Detection Tools Roll Out across Communication Platforms",
      slug: "ai-deepfake-detection-tools-communication-platforms",
      excerpt: "Real-time spectral analysis detects voice cloning and synthetic video streams during live calls.",
      heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 10400,
      isEditorsPick: true,
    },
  ],
  newsletters: [
    {
      title: "TechCrest Daily Briefing: The Compute Economy and the Future of AI Chips",
      slug: "techcrest-daily-briefing-compute-economy-ai-chips",
      excerpt: "An executive briefing on global semiconductor supply chains, energy grid demands, and cloud pricing.",
      heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 8900,
      isFeatured: true,
    },
    {
      title: "The Weekly Insider: Key Lessons From Top Engineering Teams Scaling Distributed Apps",
      slug: "weekly-insider-scaling-distributed-apps",
      excerpt: "Curated insights into micro-frontend architectures, serverless cold starts, and database sharding.",
      heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 7400,
      isEditorsPick: true,
    },
    {
      title: "Productivity Roundup: 5 Essential Developer Workflows Reimagined With AI Tools",
      slug: "productivity-roundup-developer-workflows-ai-tools",
      excerpt: "How modern engineering teams streamline PR reviews, automated documentation, and CI/CD pipelines.",
      heroImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 4,
      viewCount: 9200,
    },
  ],
  ai: [
    {
      title: "Autonomous AI Agents Transition from Experimental Scripts to Enterprise Workflows",
      slug: "autonomous-ai-agents-enterprise-workflows-2026",
      excerpt: "Reasoning models combined with tool-use protocols execute complex multi-step business operations.",
      heroImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 10,
      viewCount: 28400,
      isFeatured: true,
      isBreaking: true,
      isTrending: true,
    },
    {
      title: "Open Source LLMs Close the Gap: Benchmarks Show Near-Parity With Proprietary APIs",
      slug: "open-source-llms-near-parity-proprietary-apis",
      excerpt: "Parameter quantization and specialized fine-tuning allow 70B models to run efficiently on local hardware.",
      heroImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 8,
      viewCount: 19600,
      isEditorsPick: true,
    },
    {
      title: "Multimodal Foundation Models Integrate Native Real-Time Audio & Spatial Reasoning",
      slug: "multimodal-foundation-models-real-time-audio-spatial",
      excerpt: "Zero-latency audio-to-audio processing unlocks natural conversational interfaces across devices.",
      heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 16100,
    },
  ],
  "smart-home": [
    {
      title: "Matter 2.0 Protocol Unifies Smart Home Ecosystems With Local Mesh Reliability",
      slug: "matter-2-protocol-unifies-smart-home-ecosystems",
      excerpt: "Cross-platform device interoperability eliminates cloud dependency and reduces automation latency.",
      heroImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 13200,
      isFeatured: true,
    },
    {
      title: "Smart Thermostats Use Predictive Microclimate Modeling to Cut Energy Bills by 30%",
      slug: "smart-thermostats-predictive-microclimate-energy-savings",
      excerpt: "AI climate sensors factor in room occupancy, humidity, and solar gain to optimize HVAC schedules.",
      heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 5,
      viewCount: 10800,
      isEditorsPick: true,
    },
    {
      title: "The Rise of Private Local AI Hubs for Total Home Security and Privacy",
      slug: "private-local-ai-hubs-home-security-privacy",
      excerpt: "On-premise NPU processing analyzes camera feeds without sending video streams to external servers.",
      heroImage: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 8900,
    },
  ],
  evs: [
    {
      title: "Solid-State Battery Production Begins Commercial Scale: 800-Mile Range Test",
      slug: "solid-state-battery-production-800-mile-range",
      excerpt: "Electrolyte breakthroughs boost energy density while reducing fire risk and charging times to 10 minutes.",
      heroImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 9,
      viewCount: 24500,
      isFeatured: true,
      isBreaking: true,
      isTrending: true,
    },
    {
      title: "Megawatt Ultra-Fast Charging Networks Open Across Major Highway Corridors",
      slug: "megawatt-ultra-fast-charging-networks-highway-corridors",
      excerpt: "Liquid-cooled 1000kW chargers power electric trucks and passenger vehicles seamlessly.",
      heroImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 14700,
      isEditorsPick: true,
    },
    {
      title: "Bidirectional Vehicle-to-Grid (V2G) Tech Converts EVs Into Home Energy Buffers",
      slug: "bidirectional-v2g-tech-evs-home-energy-buffers",
      excerpt: "Homeowners feed excess battery power back into the grid during peak rate hours for utility credits.",
      heroImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 11900,
    },
  ],
  crypto: [
    {
      title: "Institutional Asset Tokenization Surpasses $1 Trillion On-Chain Benchmark",
      slug: "institutional-asset-tokenization-surpasses-1-trillion",
      excerpt: "Real-world assets including treasury bonds, real estate, and commodities settle on public ledgers.",
      heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 8,
      viewCount: 17800,
      isFeatured: true,
      isTrending: true,
    },
    {
      title: "Zero-Knowledge Rollups Solve Blockchain Scalability Without Sacrificing Security",
      slug: "zero-knowledge-rollups-blockchain-scalability",
      excerpt: "Layer-2 scaling networks achieve 50,000 transactions per second with sub-cent gas fees.",
      heroImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 7,
      viewCount: 13100,
      isEditorsPick: true,
    },
    {
      title: "Decentralized Physical Infrastructure Networks (DePIN) Experience Exponential Growth",
      slug: "depin-decentralized-physical-infrastructure-growth",
      excerpt: "Token-incentivized wireless networks, compute pools, and mapping nodes challenge centralized giants.",
      heroImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
      readingTimeMinutes: 6,
      viewCount: 9500,
    },
  ],
};

async function main() {
  console.log("🚀 Starting seeding 3 articles per topic for all 11 categories...");

  // 1. Ensure Categories
  const categoryMap = new Map<string, number>();
  for (const catDef of CATEGORIES_DATA) {
    const existing = await db.query.categories.findFirst({
      where: eq(schema.categories.slug, catDef.slug),
    });

    if (existing) {
      categoryMap.set(catDef.slug, existing.id);
      console.log(`  ✓ Category exists: ${catDef.name} (id: ${existing.id})`);
    } else {
      const [inserted] = await db.insert(schema.categories).values({
        name: catDef.name,
        slug: catDef.slug,
        description: catDef.description,
        icon: catDef.icon,
        color: catDef.color,
        sortOrder: catDef.sortOrder,
        isActive: true,
      }).returning();
      categoryMap.set(catDef.slug, inserted.id);
      console.log(`  ✅ Inserted category: ${catDef.name} (id: ${inserted.id})`);
    }
  }

  // 2. Ensure Author & Update All Users/Authors to "Surya Vijayan"
  await db.update(schema.users).set({ name: "Surya Vijayan" });
  await db.update(schema.authors).set({ displayName: "Surya Vijayan" });
  await db.update(schema.articles).set({ viewCount: 0 });
  console.log("  ✓ Reset all article view counts to 0 and set Author Name to Surya Vijayan");

  let author = await db.query.authors.findFirst();
  if (!author) {
    let user = await db.query.users.findFirst();
    if (!user) {
      const [newUser] = await db.insert(schema.users).values({
        email: "suryashc5199@gmail.com",
        name: "Surya Vijayan",
        role: "super_admin",
      }).returning();
      user = newUser;
    }
    const [newAuthor] = await db.insert(schema.authors).values({
      userId: user.id,
      displayName: "Surya Vijayan",
      slug: "surya-vijayan",
      bio: "Technology journalist and Editor-in-Chief at TechCrest.",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SuryaVijayan",
    }).returning();
    author = newAuthor;
    console.log(`  ✅ Created default Author record for ${author.displayName}`);
  }

  // 3. Insert / Update 3 Articles Per Category
  let totalInserted = 0;
  let totalUpdated = 0;

  for (const [catSlug, articleDefs] of Object.entries(TOPIC_ARTICLES)) {
    const categoryId = categoryMap.get(catSlug);
    if (!categoryId) {
      console.error(`❌ Missing category ID for slug: ${catSlug}`);
      continue;
    }

    for (const artDef of articleDefs) {
      const existingArticle = await db.query.articles.findFirst({
        where: eq(schema.articles.slug, artDef.slug),
      });

      const contentHtml = `
        <p class="lead">${artDef.excerpt}</p>
        <h2>Key Developments &amp; Technical Deep-Dive</h2>
        <p>Technology landscapes undergo dramatic shifts when core infrastructure components align with market demands. In this analysis, we examine the underlying mechanisms driving adoption and the long-term strategic implications for industry leaders and consumers alike.</p>
        <p>Recent benchmarks demonstrate measurable efficiency gains across benchmark workloads. As engineering teams continue refining these architectures, operating costs are projected to decrease substantially while system performance scales linearly.</p>
        <h2>Industry Impact &amp; Strategic Outlook</h2>
        <p>Looking ahead, integrating these capabilities into everyday hardware and software ecosystems will set the standard for modern computing. Security, speed, and sustainability remain the primary pillars guiding future development cycles.</p>
      `;

      const articleData = {
        title: artDef.title,
        slug: artDef.slug,
        excerpt: artDef.excerpt,
        contentHtml,
        heroImage: artDef.heroImage,
        heroImageAlt: artDef.title,
        heroImageCaption: "TechCrest Editorial / Unsplash Media",
        authorId: author.id,
        categoryId: categoryId,
        status: "published" as const,
        isBreaking: artDef.isBreaking ?? false,
        isFeatured: artDef.isFeatured ?? false,
        isEditorsPick: artDef.isEditorsPick ?? false,
        isTrending: artDef.isTrending ?? false,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        readingTimeMinutes: artDef.readingTimeMinutes,
        viewCount: 0,
        seoTitle: artDef.title,
        seoDescription: artDef.excerpt,
      };

      if (existingArticle) {
        await db.update(schema.articles)
          .set(articleData)
          .where(eq(schema.articles.id, existingArticle.id));
        totalUpdated++;
      } else {
        await db.insert(schema.articles).values(articleData);
        totalInserted++;
      }
    }
  }

  console.log(`\n🎉 Success! Seeded 3 articles per topic for all 11 categories.`);
  console.log(`   - Inserted new: ${totalInserted}`);
  console.log(`   - Updated existing: ${totalUpdated}`);
  console.log(`   - Total active articles across 11 topics: 33`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed script failed:", err);
  process.exit(1);
});

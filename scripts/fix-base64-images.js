const { neon } = require("@neondatabase/serverless");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "xeizctbn",
  api_key: process.env.CLOUDINARY_API_KEY || "984383337327624",
  api_secret: process.env.CLOUDINARY_API_SECRET || "xN3fNkM01NYiUZ2q8t1J7HAohjE",
});

const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_eth7HMgOuKI9@ep-soft-sky-az2w1zie-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

async function runMigration() {
  console.log("🔍 Scanning Neon database for Base64 inline images...");

  const articles = await sql`
    SELECT id, title, hero_image 
    FROM articles 
    WHERE hero_image LIKE 'data:image/%'
  `;

  console.log(`Found ${articles.length} articles with Base64 image data in Neon.`);

  let articlesMigrated = 0;
  for (const article of articles) {
    try {
      console.log(`Uploading image for Article #${article.id}: "${article.title}" to Cloudinary...`);
      
      const res = await cloudinary.uploader.upload(article.hero_image, {
        folder: "technews_articles",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      await sql`
        UPDATE articles 
        SET hero_image = ${res.secure_url}
        WHERE id = ${article.id}
      `;

      articlesMigrated++;
      console.log(`  ✅ Successfully uploaded to Cloudinary: ${res.secure_url}`);
    } catch (err) {
      console.error(`  ❌ Failed to upload image for Article #${article.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Image migration complete! Migrated ${articlesMigrated} articles to Cloudinary.`);
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration Script Error:", err);
  process.exit(1);
});

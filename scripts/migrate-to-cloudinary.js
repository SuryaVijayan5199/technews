const postgres = require("postgres");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "xeizctbn",
  api_key: process.env.CLOUDINARY_API_KEY || "545455229477658",
  api_secret: process.env.CLOUDINARY_API_SECRET || "lRVvHK11b1-4TV7JRguAV4-mGj0",
});

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_HSCF6LkV0eAX@ep-wild-butterfly-azhaalkx.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = postgres(connectionString);

async function runMigration() {
  console.log("🔍 Scanning Neon database for Base64 inline images...");

  // 1. Articles with Base64 hero_image
  const articles = await sql`
    SELECT id, title, hero_image 
    FROM articles 
    WHERE hero_image LIKE 'data:image/%'
  `;

  console.log(`Found ${articles.length} articles with Base64 image data in Neon.`);

  let articlesMigrated = 0;
  for (const article of articles) {
    try {
      console.log(`[${articlesMigrated + 1}/${articles.length}] Uploading image for Article #${article.id}: "${article.title ? article.title.substring(0, 30) : 'Untitled'}..." to Cloudinary...`);
      
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

  // 2. Authors with Base64 avatar
  const authors = await sql`
    SELECT id, display_name, avatar 
    FROM authors 
    WHERE avatar LIKE 'data:image/%'
  `;

  console.log(`Found ${authors.length} authors with Base64 avatar data in Neon.`);

  let authorsMigrated = 0;
  for (const author of authors) {
    try {
      console.log(`Uploading avatar for Author #${author.id}: "${author.display_name}" to Cloudinary...`);
      
      const res = await cloudinary.uploader.upload(author.avatar, {
        folder: "technews_avatars",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      await sql`
        UPDATE authors 
        SET avatar = ${res.secure_url}
        WHERE id = ${author.id}
      `;

      authorsMigrated++;
      console.log(`  ✅ Successfully uploaded avatar to Cloudinary: ${res.secure_url}`);
    } catch (err) {
      console.error(`  ❌ Failed to upload avatar for Author #${author.id}:`, err.message);
    }
  }

  console.log("\n🧹 Reclaiming disk space in Neon database...");
  try {
    await sql`VACUUM FULL articles;`;
    await sql`VACUUM FULL authors;`;
    console.log("  ✅ Reclaimed database disk space in Neon via VACUUM FULL.");
  } catch (vErr) {
    console.log("  ℹ️ Vacuum notice:", vErr.message);
  }

  console.log("\n🎉 ALL IMAGE MIGRATIONS COMPLETED SUCCESSFULLY!");
  console.log(`Total Articles Migrated to Cloudinary: ${articlesMigrated} / ${articles.length}`);
  console.log(`Total Authors Migrated to Cloudinary: ${authorsMigrated} / ${authors.length}`);

  await sql.end();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration Script Error:", err);
  process.exit(1);
});

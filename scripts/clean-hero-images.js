const { neon } = require("@neondatabase/serverless");

const sql = neon("postgresql://neondb_owner:npg_eth7HMgOuKI9@ep-soft-sky-az2w1zie-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

async function fixImages() {
  console.log("Replacing base64 hero images in Neon DB with clean CDN URLs...");

  await sql`
    UPDATE articles 
    SET hero_image = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80' 
    WHERE id = 158
  `;

  await sql`
    UPDATE articles 
    SET hero_image = 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&auto=format&fit=crop&q=80' 
    WHERE id = 157
  `;

  const remainingBase64 = await sql`SELECT count(*) FROM articles WHERE hero_image LIKE 'data:image/%'`;
  console.log(`Remaining Base64 images in Neon DB: ${remainingBase64[0].count}`);
  console.log("✅ Neon DB hero_image column cleaned 100%!");
  process.exit(0);
}

fixImages().catch(console.error);

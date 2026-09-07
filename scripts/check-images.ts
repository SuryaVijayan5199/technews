import { config } from "dotenv";
config({ path: ".env.local" });

async function run() {
  const { db } = await import("../lib/db");
  const arts = await db.query.articles.findMany({ limit: 15 });
  console.log("HERO IMAGES IN DB:");
  arts.forEach((a: any) => {
    console.log(`ID: ${a.id} | Image: ${a.heroImage ? a.heroImage.substring(0, 100) : "NULL"}`);
  });
  process.exit(0);
}
run();

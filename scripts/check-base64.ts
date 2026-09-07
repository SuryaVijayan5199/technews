import { config } from "dotenv";
config({ path: ".env.local" });

async function run() {
  const { db } = await import("../lib/db");
  const arts = await db.query.articles.findMany();
  console.log("Checking articles...");
  arts.forEach((a: any) => {
    if (a.heroImage?.startsWith("data:")) {
      console.log("ARTICLE WITH BASE64 HERO:", a.id, a.title, "len:", a.heroImage.length);
    }
    if (a.contentHtml?.includes("data:image")) {
      console.log("ARTICLE WITH BASE64 CONTENT:", a.id, a.title, "len:", a.contentHtml.length);
    }
  });
  const authorsList = await db.query.authors.findMany();
  authorsList.forEach((au: any) => {
    if (au.avatar?.startsWith("data:")) {
      console.log("AUTHOR WITH BASE64 AVATAR:", au.id, au.displayName, "len:", au.avatar.length);
    }
  });
  process.exit(0);
}
run();

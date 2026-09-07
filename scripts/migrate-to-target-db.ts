/**
 * Data Migration Script: Neon DB ➔ Aiven PostgreSQL
 * 
 * Usage:
 *   1. Set TARGET_DATABASE_URL in .env.local or environment:
 *      TARGET_DATABASE_URL="postgres://user:pass@host:port/dbname?sslmode=require"
 *   2. Run:
 *      npx tsx scripts/migrate-to-target-db.ts
 * 
 * This script copies 100% of categories, users, authors, articles, comments,
 * newsletter subscribers, bookmarks, and reading history from your current
 * Neon database to your new Aiven PostgreSQL database.
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

const sourceUrl = process.env.DATABASE_URL;
const targetUrl = process.env.TARGET_DATABASE_URL;

if (!sourceUrl) {
  console.error("❌ Source DATABASE_URL is not set in .env.local!");
  process.exit(1);
}

if (!targetUrl) {
  console.log("ℹ️  TARGET_DATABASE_URL is not set.");
  console.log("👉 Please set TARGET_DATABASE_URL='postgresql://user:pass@host:port/dbname?sslmode=require' in .env.local to execute database migration.");
  process.exit(0);
}

async function runMigration() {
  console.log("🚀 Starting database migration from Source ➔ Target Database...");

  // Source DB (Neon)
  const sourceClient = neon(sourceUrl!);
  const sourceDb = drizzleNeon(sourceClient, { schema });

  // Target DB (Aiven / Postgres)
  const targetClient = postgres(targetUrl!, { ssl: "require", max: 5 });
  const targetDb = drizzlePg(targetClient, { schema });

  try {
    // 1. Categories
    console.log("📦 1/8 Exporting Categories...");
    const cats = await sourceDb.query.categories.findMany();
    if (cats.length > 0) {
      console.log(`   Migrating ${cats.length} categories...`);
      for (const c of cats) {
        await targetDb.insert(schema.categories).values(c).onConflictDoNothing();
      }
    }

    // 2. Users
    console.log("👤 2/8 Exporting Users...");
    const usrList = await sourceDb.query.users.findMany();
    if (usrList.length > 0) {
      console.log(`   Migrating ${usrList.length} users...`);
      for (const u of usrList) {
        await targetDb.insert(schema.users).values(u).onConflictDoNothing();
      }
    }

    // 3. Authors
    console.log("✍️ 3/8 Exporting Authors...");
    const autList = await sourceDb.query.authors.findMany();
    if (autList.length > 0) {
      console.log(`   Migrating ${autList.length} authors...`);
      for (const a of autList) {
        await targetDb.insert(schema.authors).values(a).onConflictDoNothing();
      }
    }

    // 4. Articles
    console.log("📰 4/8 Exporting Articles...");
    const artList = await sourceDb.query.articles.findMany();
    if (artList.length > 0) {
      console.log(`   Migrating ${artList.length} articles...`);
      for (const art of artList) {
        await targetDb.insert(schema.articles).values(art).onConflictDoNothing();
      }
    }

    // 5. Comments
    console.log("💬 5/8 Exporting Comments...");
    const cmtList = await sourceDb.query.comments.findMany();
    if (cmtList.length > 0) {
      console.log(`   Migrating ${cmtList.length} comments...`);
      for (const c of cmtList) {
        await targetDb.insert(schema.comments).values(c).onConflictDoNothing();
      }
    }

    // 6. Newsletter Subscribers
    console.log("📧 6/8 Exporting Newsletter Subscribers...");
    const subList = await sourceDb.query.newsletterSubscribers.findMany();
    if (subList.length > 0) {
      console.log(`   Migrating ${subList.length} newsletter subscribers...`);
      for (const s of subList) {
        await targetDb.insert(schema.newsletterSubscribers).values(s).onConflictDoNothing();
      }
    }

    // 7. Bookmarks
    console.log("🔖 7/8 Exporting User Bookmarks...");
    const bkmList = await sourceDb.query.bookmarks.findMany();
    if (bkmList.length > 0) {
      console.log(`   Migrating ${bkmList.length} bookmarks...`);
      for (const b of bkmList) {
        await targetDb.insert(schema.bookmarks).values(b).onConflictDoNothing();
      }
    }

    // 8. Reading History
    console.log("📜 8/8 Exporting Reading History...");
    const histList = await sourceDb.query.readingHistory.findMany();
    if (histList.length > 0) {
      console.log(`   Migrating ${histList.length} history items...`);
      for (const h of histList) {
        await targetDb.insert(schema.readingHistory).values(h).onConflictDoNothing();
      }
    }

    console.log("✅ Data Migration Completed Successfully! All records transferred to Target Database.");
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
  } finally {
    await targetClient.end();
    process.exit(0);
  }
}

runMigration();

import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

export function getConnectionString(): string {
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const cf = getCloudflareContext();
    if (cf?.env?.HYPERDRIVE?.connectionString) {
      return cf.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Fallback for build time or non-Cloudflare request context
  }
  return process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

export function createDatabaseInstance() {
  const connStr = getConnectionString();
  const isNeon = connStr.includes("neon.tech");

  if (isNeon) {
    return drizzleNeon(neon(connStr), { schema });
  }

  const client = postgres(connStr, {
    ssl: "require",
    max: 5,
    connect_timeout: 10,
    idle_timeout: 30,
  });

  return drizzlePg(client, { schema });
}

export const db: any = createDatabaseInstance();

export type Database = typeof db;

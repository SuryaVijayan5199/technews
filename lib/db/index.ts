import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "./schema";

export function getConnectionString(): string {
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const cf = getCloudflareContext();
    if (cf?.env?.HYPERDRIVE?.connectionString) {
      return cf.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Fallback if invoked outside request scope
  }
  return process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

const connectionString = getConnectionString();
const isNeon = connectionString.includes("neon.tech");

export const db: any = isNeon
  ? drizzleNeon(neon(connectionString), { schema })
  : drizzlePg(
      new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 5,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      }),
      { schema }
    );

export type Database = typeof db;

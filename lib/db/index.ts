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
    // Ignore error if invoked outside request scope
  }
  return process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

const connectionString = getConnectionString();
const isNeon = connectionString.includes("neon.tech");

export const db: any = isNeon
  ? drizzleNeon(neon(connectionString), { schema })
  : drizzlePg(
      postgres(connectionString, {
        ssl: "require",
        max: 5,
        connect_timeout: 10,
        idle_timeout: 30,
      }),
      { schema }
    );

export type Database = typeof db;

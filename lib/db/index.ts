import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

function getConnectionString(): string {
  if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const cf = getCloudflareContext();
    if (cf?.env?.HYPERDRIVE?.connectionString) {
      return cf.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Ignore error outside Cloudflare request scope
  }
  return "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

const connectionString = getConnectionString();

export const db: any = connectionString.includes("neon.tech")
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

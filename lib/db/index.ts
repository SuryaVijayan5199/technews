import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString =
  process.env.HYPERDRIVE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const isNeon = connectionString.includes("neon.tech");

export const db: any = isNeon
  ? drizzleNeon(neon(connectionString), { schema })
  : drizzlePg(
      new Pool({
        connectionString,
        ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
        max: 5,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      }),
      { schema }
    );

export type Database = typeof db;

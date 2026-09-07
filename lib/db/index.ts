import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const isNeon = connectionString.includes("neon.tech");

export const db: any = isNeon
  ? drizzleNeon(neon(connectionString), { schema })
  : drizzlePg(postgres(connectionString, { ssl: "require", max: 10 }), { schema });

export type Database = typeof db;

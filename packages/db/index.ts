import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";
export * as types from "./types";
export { union } from "drizzle-orm/pg-core";
export * from "drizzle-orm";

export const db = drizzle(sql, { schema });

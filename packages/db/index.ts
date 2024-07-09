import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import * as schema from "./schema";

export { union } from "drizzle-orm/pg-core";
export * from "drizzle-orm";
export const db = drizzle(sql, { schema });

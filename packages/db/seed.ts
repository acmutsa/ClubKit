import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { seed } from "drizzle-seed";
import { createClient } from "@libsql/client";

async function main() {
	const db = drizzle(
		createClient({
			url: process.env.TURSO_DATABASE_URL!,
			authToken: process.env.TURSO_AUTH_TOKEN,
		}),
	);

	await seed(db, schema);
}

main();

import { sql } from "@vercel/postgres";
import { drizzle as pgDrizzle } from "drizzle-orm/vercel-postgres";
import { drizzle } from "drizzle-orm/libsql";
import * as pgSchema from "./schema";
import { createClient } from "@libsql/client";
export * from "drizzle-orm";
import dotenv from "dotenv";
import * as schema from "db/schema";

dotenv.config({
	path: "../../.env",
});

const dbPostgres = pgDrizzle(sql, { schema: pgSchema });
const turso = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(turso, { schema });

const allUsersPromise = dbPostgres.query.users.findMany();
const allDataPromise = dbPostgres.query.data.findMany();
const allEventsPromise = dbPostgres.query.events.findMany();
const allCheckinsPromise = dbPostgres.query.checkins.findMany();
const allEventCategoriesPromise = dbPostgres.query.eventCategories.findMany();
const allSemestersPromise = dbPostgres.query.semesters.findMany();
const allEventsToCategoriesPromise =
	dbPostgres.query.eventsToCategories.findMany();

const queriesToRun = [
	allUsersPromise,
	allDataPromise,
	allEventsPromise,
	allCheckinsPromise,
	allEventCategoriesPromise,
	allSemestersPromise,
	allEventsToCategoriesPromise,
];

async function migratePostgresSqLite() {
	console.log("Starting Migration 🚀");
	console.log("Fetching Postgres Data 🐘");
	const [
		allUsers,
		allData,
		allEvents,
		allCheckins,
		allEventCategories,
		allSemesters,
		allEventsToCategories,
	] = await Promise.all([
		allUsersPromise,
		allDataPromise,
		allEventsPromise,
		allCheckinsPromise,
		allEventCategoriesPromise,
		allSemestersPromise,
		allEventsToCategoriesPromise,
	]);
	console.log("Postgres data fetched 📦");

	console.log("Migrating Users 👥");
	await db.insert(schema.users).values(allUsers);
	console.log("Migrated Users ✅");

	console.log("Migrating User Data 📊");
	await db.insert(schema.data).values(allData);
	console.log("Migrated User Data ✅");

	console.log("Migrating Event Categories 💬");
	await db.insert(schema.eventCategories).values(allEventCategories);
	console.log("Migrated Event Categories ✅");

	console.log("Migrating Semesters 📚");
	await db.insert(schema.semesters).values(allSemesters);
	console.log("Migrated Semesters ✅");

	console.log("Migrating Events 📝");
	await db.insert(schema.events).values(
		allEvents.map((event) => ({
			...event,
			updatedAt: event.updatedAt.getTime(),
		})),
	);
	console.log("Migrated Events ✅");

	console.log("Migrating Events to Categories 📝");
	await db.insert(schema.eventsToCategories).values(allEventsToCategories);
	console.log("Migrated Events to Categories ✅");

	console.log("Migrating Checkins 📝");
	await db.insert(schema.checkins).values(allCheckins);
	console.log("Migrated Checkins ✅");

	return process.exit(0);
}

migratePostgresSqLite().catch((e) => {
	console.error(e);
	process.exit(1);
});

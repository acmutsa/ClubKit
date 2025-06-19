import { sql } from "@vercel/postgres";
import { drizzle as pgDrizzle } from "drizzle-orm/vercel-postgres";
import { drizzle } from "drizzle-orm/libsql";
import * as pgSchema from "./schema";
import { createClient } from "@libsql/client";
export * from "drizzle-orm";
import dotenv from "dotenv";
import * as schema from "db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import c, { staticUploads } from "config";
import { eq } from "drizzle-orm";

dotenv.config({
	path: "../../.env",
});

export const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
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

async function migratePostgresSqLite(runDB = false) {
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
	// console.log("Postgres data fetched 📦");

	// console.log("Migrating Users 👥");
	// await db.insert(schema.users).values(allUsers);
	// console.log("Migrated Users ✅");

	// console.log("Migrating User Data 📊");
	// await db.insert(schema.data).values(allData);
	// console.log("Migrated User Data ✅");

	// console.log("Migrating Event Categories 💬");
	// await db.insert(schema.eventCategories).values(allEventCategories);
	// console.log("Migrated Event Categories ✅");

	// console.log("Migrating Semesters 📚");
	// await db.insert(schema.semesters).values(allSemesters);
	// console.log("Migrated Semesters ✅");

	// console.log("Migrating Events 📝");
	// await db.insert(schema.events).values(
	// 	allEvents.map((event) => ({
	// 		...event,
	// 		updatedAt: event.updatedAt.getTime(),
	// 	})),
	// );
	// console.log("Migrated Events ✅");

	// console.log("Migrating Events to Categories 📝");
	// await db.insert(schema.eventsToCategories).values(allEventsToCategories);
	// console.log("Migrated Events to Categories ✅");

	// console.log("Migrating Checkins 📝");
	// await db.insert(schema.checkins).values(allCheckins);
	// console.log("Migrated Checkins ✅");

	console.log("Migrating Vercel Blob Files To R2");

	const resumeData = await db.query.data.findMany({
		columns: { resume: true, userID: true },
	});

	for (let resumeEntry of resumeData) {
		const { resume: resumeUrlAsString, userID } = resumeEntry;
		if (
			resumeUrlAsString === null ||
			!resumeUrlAsString.length ||
			resumeUrlAsString.startsWith("/api")
		)
			continue;
		console.log("Migrating resume for user", userID, resumeUrlAsString);
		const resumeUrl = new URL(resumeUrlAsString);
		const resumeFetchResponse = await fetch(resumeUrl);

		if (!resumeFetchResponse.ok) {
			console.log("resume fetch failed");
			continue;
		}
		const resumeBlob = await resumeFetchResponse.blob();

		let key = decodeURIComponent(resumeUrl.pathname);
		// if the first character is a slash, remove it
		if (key.charAt(0) === "/") {
			key = key.slice(1);
		}

		const buffer = await resumeBlob.arrayBuffer();

		const cmd = new PutObjectCommand({
			Key: key,
			Bucket: process.env.R2_BUCKET_NAME!,
			ContentType: "application/pdf",
			///@ts-expect-error
			Body: buffer,
		});

		await S3.send(cmd);

		// New url to correspond to an api route
		const newResumeUrl = `/api/upload/resume/view?key=${key}`;

		await db
			.update(schema.data)
			.set({ resume: newResumeUrl.toString() })
			.where(eq(schema.data.userID, userID));
	}

	console.log("Migrated Vercel Blob Files To R2");

	return process.exit(0);
}

migratePostgresSqLite().catch((e) => {
	console.error(e);
	process.exit(1);
});

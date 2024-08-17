import { db, count, sql } from "db";
import { data, users } from "db/schema";

export async function getRegistrationsByMonth() {
	return await db
		.select({
			month: sql`EXTRACT(MONTH FROM ${users.joinDate})`.mapWith(Number),
			count: count(),
		})
		.from(users)
		.where(
			sql`${users.joinDate} > NOW() - INTERVAL '1 year' AND ${users.joinDate} < NOW()`,
		)
		.groupBy(sql`EXTRACT(MONTH FROM ${users.joinDate})`)
		.orderBy(sql`EXTRACT(MONTH FROM ${users.joinDate})`);
}

export async function getUserClassifications() {
	return await db
		.select({
			classification: sql`LOWER(${data.classification})`.mapWith(String),
			count: count(),
			fill: sql`CONCAT('var(--color-',LOWER(${data.classification}),')')`.mapWith(
				String,
			),
		})
		.from(data)
		.groupBy(sql`LOWER(${data.classification})`.mapWith(String));
}

export async function getGenderDistribution() {
	return await db
		.select({
			gender: sql`LOWER(${data.gender})`.mapWith(String),
			count: count(),
			fill: sql`CONCAT('var(--color-',LOWER(${data.gender}),')')`.mapWith(
				String,
			),
		})
		.from(data)
		.groupBy(sql`LOWER(${data.gender})`.mapWith(String));
}

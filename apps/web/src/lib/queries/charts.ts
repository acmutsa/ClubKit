import { db, count, sql } from "db";
import { data, users } from "db/schema";

export async function getRegistrationsByMonth() {
	return await db
		.select({
			month: sql`strftime('%m', ${users.joinDate})`.mapWith(Number),
			count: count(),
		})
		.from(users)
		.where(
			sql`${users.joinDate} > datetime('now', '-1 year') AND ${users.joinDate} < datetime('now')`,
		)
		.groupBy(sql`strftime('%m', ${users.joinDate})`)
		.orderBy(sql`strftime('%m', ${users.joinDate})`);
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

import { db, count, sql } from "db";
import { users } from "db/schema";

export async function getRegistrationsByMonth() {
	return await db
		.select({
			month: sql`EXTRACT(MONTH FROM ${users.joinDate})`.mapWith(Number),
			count: count(),
		})
		.from(users)
		.groupBy(sql`EXTRACT(MONTH FROM ${users.joinDate})`)
		.orderBy(sql`EXTRACT(MONTH FROM ${users.joinDate})`);
}

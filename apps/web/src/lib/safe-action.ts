import { createSafeActionClient } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { db, eq } from "db";
import { users } from "db/schema";

export const action = createSafeActionClient();

export const authenticatedAction = createSafeActionClient({
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Unauthorized");
		return { clerkID: userId };
	},
});

export const adminAction = createSafeActionClient({
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.query.users.findFirst({
			where: eq(users.clerkID, userId),
		});

		if (!user || (user.role !== "admin" && user.role !== "super_admin"))
			throw new Error("Unauthorized");

		return { userRole: user.role, adminID: user.userID };
	},
});

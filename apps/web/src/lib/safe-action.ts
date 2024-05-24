import { createSafeActionClient } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";

export const action = createSafeActionClient();

export const authenticatedAction = createSafeActionClient({
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Unauthorized");
		return { clerkID: userId };
	},
});

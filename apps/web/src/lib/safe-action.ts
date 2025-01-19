import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
	returnValidationErrors,
} from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { db, eq } from "db";
import { users } from "db/schema";
import z from "zod";

class ActionError extends Error {}

export const actionClient = createSafeActionClient({
	handleServerError: (e, utils) => {
		// You can access these properties inside the `utils` object.
		const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;

		// Log to console.
		console.error("Action error:", e.message);

		// Return generic message
		return "Oh no, something went wrong!";
	},
});

export const authenticatedAction = actionClient.use(async ({ next }) => {
	const { userId: clerkID } = auth();
	if (!clerkID)
		returnValidationErrors(z.null(), {
			_errors: ["Unauthorized (No User ID)"],
		});
	return next({ ctx: { clerkID } });
});

export const userAction = authenticatedAction.use(async ({ next, ctx }) => {
	const { clerkID } = ctx;
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, clerkID),
	});

	if (!user) {
		returnValidationErrors(z.null(), {
			_errors: ["Unauthorized (User Not Found)"],
		});
	}

	return next({
		ctx: { userRole: user.role, userID: user.userID },
	});
});

export const adminAction = userAction.use(async ({ next, ctx }) => {
	if (!(ctx.userRole === "admin" || ctx.userRole === "super_admin")) {
		returnValidationErrors(z.null(), {
			_errors: ["Unauthorized (Not Admin)"],
		});
	}
	return next({ ctx });
});

export const executiveAction = userAction.use(async ({ next, ctx }) => {
	if (ctx.userRole !== "super_admin") {
		returnValidationErrors(z.null(), {
			_errors: ["Unauthorized (Not a super admin)"],
		});
	}
	return next({ ctx });
});

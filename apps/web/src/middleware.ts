import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { getAdminUser } from "./lib/queries/users";
import { NextResponse } from "next/server";
const isProtectedRoute = createRouteMatcher([
	"/dash(.*)",
	"/admin(.*)",
	"/settings(.*)",
]);
const isAdminAPIRoute = createRouteMatcher(["/api/admin(.*)"]);

// come back and check if this is valid
export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();

	if (isProtectedRoute(req)) {
		await auth.protect();
	}

	// protect admin api routes
	if (isAdminAPIRoute(req)) {
		if (!userId || !(await getAdminUser(userId))) {
			return NextResponse.json({ error: "Unauthorized", status: 401 });
		}
	}
});

export const config = {
	// Protects all routes, including api/trpc.
	// See https://clerk.com/docs/references/nextjs/auth-middleware
	// for more information about configuring your Middleware
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

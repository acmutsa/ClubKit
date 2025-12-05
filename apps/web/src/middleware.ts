import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { getAdminUser, getUserByClerkId } from "./lib/queries/users";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
	"/dash(.*)",
	"/admin(.*)",
	"/settings(.*)",
]);
const isAdminAPIRoute = createRouteMatcher(["/api/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const { userId, redirectToSignIn } = await auth();
	
	// Protect routes - redirect to sign-in if not authenticated
	if (isProtectedRoute(req) && !userId) {
		return redirectToSignIn({
			returnBackUrl: req.nextUrl.toString(),
		});
	}

	// Handle authenticated user routing
	if (userId) {
		const user = await getUserByClerkId(userId);
		
		// Redirect authenticated users away from auth pages
		if (isAuthRoute(req)) {
			return NextResponse.redirect(new URL(user ? "/dash" : "/onboarding", req.url));
		}
		
		// Redirect registered users away from onboarding
		if (isOnboardingRoute(req) && user) {
			return NextResponse.redirect(new URL("/dash", req.url));
		}
		
		// Redirect unregistered users to onboarding from protected routes
		if (isProtectedRoute(req) && !user) {
			return NextResponse.redirect(new URL("/onboarding", req.url));
		}
	}

	// Protect admin API routes
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

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isProtectedRoute = createRouteMatcher(["/dash(.*)", "/admin(.*)"]);

export default clerkMiddleware(
	(auth, req) => {
		if (isProtectedRoute(req)) {
			auth().protect();
		}
	},
	{ afterSignUpUrl: "/register" }
);

export const config = {
	// Protects all routes, including api/trpc.
	// See https://clerk.com/docs/references/nextjs/auth-middleware
	// for more information about configuring your Middleware
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

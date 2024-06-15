import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import FullScreenMessage from "@/components/shared/fullscreen-message";
import Navbar from "@/components/shared/navbar";
import DashNavItem from "@/components/dash/shared/DashNavItem";
import ClientToast from "@/components/shared/client-toast";
import { Suspense } from "react";
import c from "config";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect("/sign-in");
	}

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
		console.log("Denying admin access to user", user);
		return (
			<FullScreenMessage
				title="Access Denied"
				message="You are not an admin. If you belive this is a mistake, please contact a administrator."
			/>
		);
	}
	return (
		<>
			<ClientToast />
			<Navbar siteRegion="Admin" />
			<div className="z-20 flex h-12 w-full border-b px-5">
				{Object.entries(c.dashPaths.admin).map(([name, path]) => {
					return <DashNavItem key={name} name={name} path={path} />;
				})}
			</div>
			<Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
		</>
	);
}

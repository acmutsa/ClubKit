import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/navbar";

export default async function DashLayout({
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

	if (!user) {
		return redirect("/onboarding");
	}

	return (
		<>
			<Navbar siteRegion="Dashboard" showBorder />
			<div>{children}</div>
		</>
	);
}

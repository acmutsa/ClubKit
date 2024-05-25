import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";

export default async function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-in");

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user) return redirect("/onboarding");
	return (
		<div>
			Dash Index <SignOutButton />
		</div>
	);
}

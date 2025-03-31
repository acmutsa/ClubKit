import { Toaster } from "@/components/ui/sonner";
import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// TODO: protect stuffs from re-registration

	const { userId } = await auth();

	if (!userId) return redirect("/sign-up");

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (user) {
		return redirect("/dash");
	}

	return (
		<>
			{children}
			<Toaster />
		</>
	);
}

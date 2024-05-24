import RegisterForm from "@/components/onboarding/registerForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-up");

	const clerkUser = await currentUser();

	if (!clerkUser) return redirect("/sign-up");

	const dbUser = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (dbUser) return redirect("/dash");

	return (
		<main className="w-screen">
			<div className="max-w-5xl mx-auto min-h-screen pt-40">
				<div className="grid grid-cols-2">
					<div>
						<h1 className="font-black text-5xl">Registration</h1>
						<p className="mt-5 font-medium">
							<span className="font-bold">Welcome!</span> Please fill out the form
							below to complete your registration.
						</p>
					</div>
					<div className="bg-primary rounded-lg text-white flex flex-col items-center justify-center gap-y-3">
						<p className="text-sm font-bold">Had a portal (abc123 & email) account?</p>
						<Link href="/onboarding/migrate">
							<Button className="w-full dark">Migrate from Portal</Button>
						</Link>
					</div>
				</div>
				<RegisterForm defaultEmail={clerkUser.emailAddresses[0]?.emailAddress || ""} />
			</div>
		</main>
	);
}

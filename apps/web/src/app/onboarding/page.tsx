import RegisterForm from "@/components/onboarding/registerForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db,eq } from "db";
import { users } from "db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import c from "config";

export default async function Page() {
	
	const clerkUser = await currentUser();

	if (!clerkUser) return redirect("/sign-in");
	const userEmail = clerkUser.emailAddresses[0].emailAddress;

	const userByEmail = await db.query.users.findFirst({
		where:eq(users.email,userEmail)
	})

	if (userByEmail){
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center space-y-3 px-3">
				<h1 className="text-4xl font-black">Account Detected</h1>
				<div className="flex max-w-[30%] flex-col items-center justify-between space-y-5 rounded-xl border-2 border-muted p-6 pb-4">
					<div className="flex w-full flex-col justify-center space-y-2">
						<p className="w-full text-center">
							An unconnected account with the email{" "}
							<span className="font-semibold">{userEmail}</span>{" "}
							has been found.
						</p>
						<p className="w-full text-center">
							Please follow the link below to connect the account.
						</p>
					</div>
					<Link href="/onboarding/migrate">
						<Button> Connect Account</Button>
					</Link>
				</div>
				<p className="w-full max-w-[30%] text-center text-xs">
					If you believe this is a mistake or have trouble connecting
					the account, please reach out to{" "}
					<span>
						<a
							className="underline"
							href={`mailto:${c.contactEmail}`}
						>
							{c.contactEmail}.
						</a>
					</span>
				</p>
			</div>
		);
	}

	// the school id / abc123 is also a unique field which would throw if a user signs up with a different email but the same school id. We need to combat that 
	return (
		<main className="w-screen mb-3 overflow-x-hidden">
			<div className="mx-auto min-h-screen max-w-5xl pt-20 lg:pt-24 px-3 lg:px-0">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
					<div>
						<h1 className="text-5xl font-black">Registration</h1>
						<p className="mt-5 font-medium">
							<span className="font-bold">Welcome!</span> Please
							fill out the form below to complete your
							registration.
						</p>
					</div>
					<div className="flex flex-col items-center justify-center gap-y-3 rounded-lg bg-primary pb-2">
						<p className="text-sm font-semibold md:font-bold text-white dark:text-black">
							Had a legacy portal (abc123 & email) account?
						</p>
						<Link href="/onboarding/migrate">
							<Button className="w-full dark:bg-black bg-white dark:text-white text-black">
								Migrate from Portal
							</Button>
						</Link>
					</div>
				</div>
				<RegisterForm defaultEmail={userEmail} />
			</div>
		</main>
	);
}

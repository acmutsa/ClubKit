import RegisterForm from "@/components/onboarding/registerForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// layout protects this so we do not have to make this db call twice
export default async function Page() {
	
	const clerkUser = await currentUser();

	if (!clerkUser) return redirect("/sign-in");
	const userEmail = clerkUser.emailAddresses[0].emailAddress;

	return (
		<main className="w-screen">
			<div className="mx-auto min-h-screen max-w-5xl pt-40">
				<div className="grid grid-cols-2">
					<div>
						<h1 className="text-5xl font-black">Registration</h1>
						<p className="mt-5 font-medium">
							<span className="font-bold">Welcome!</span> Please
							fill out the form below to complete your
							registration.
						</p>
					</div>
					<div className="flex flex-col items-center justify-center gap-y-3 rounded-lg bg-primary text-white">
						<p className="text-sm font-bold">
							Had a portal (abc123 & email) account?
						</p>
						<Link href="/onboarding/migrate">
							<Button className="dark w-full">
								Migrate from Portal
							</Button>
						</Link>
					</div>
				</div>
				<RegisterForm
					defaultEmail={
						clerkUser.emailAddresses[0]?.emailAddress || ""
					}
				/>
			</div>
		</main>
	);
}

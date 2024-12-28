import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Migrator from "@/components/onboarding/migrator";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
	const user = await currentUser();
	if (!user) {
		return redirect("/sign-in");
	}
	const clerkEmail = user.emailAddresses[0].emailAddress;
	return (
		<main className="flex min-h-screen w-screen items-center justify-center">
			<div>
				<h1 className="pb-5 text-5xl font-black">Migrate</h1>
				<Migrator clerkEmail={clerkEmail} />
			</div>
		</main>
	);
}

import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import c from "config";
import Link from "next/link";

export default function Page() {
	return (
		<main className="flex h-screen w-screen flex-col items-center justify-center gap-y-5">
			<div className="flex max-w-[400px] flex-col items-center justify-center gap-y-5">
				<h1 className="text-4xl font-black">ClubKit</h1>
				<SignUp forceRedirectUrl={"/onboarding"} />
				{/* TODO: Add Explainer For Portal Accounts as a Dialog */}
				<Link href="/onboarding" className="w-full">
					<Button className="w-full">
						Migrating From A Portal Account?
					</Button>
				</Link>
			</div>
		</main>
	);
}

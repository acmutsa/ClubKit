import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import c from "config";
import Link from "next/link";
import PortalMigrationExplainer from "@/components/dash/shared/PortalMigrationExplainer";
export default function Page() {
	return (
		<main className="flex h-screen w-screen flex-col items-center justify-center gap-y-5">
			<div className="flex max-w-[400px] flex-col items-center justify-center gap-y-5">
				<h1 className="text-4xl font-black">{c.clubName}</h1>
				<SignIn />
				<Link href="/onboarding/migrate" className="w-full">
					<Button className="w-full">
						Migrate From Legacy Portal
					</Button>
				</Link>
				<PortalMigrationExplainer />
			</div>
		</main>
	);
}

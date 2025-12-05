"use client";
import { SignUp, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import c from "config";
import Link from "next/link";
import PortalMigrationExplainer from "@/components/dash/shared/PortalMigrationExplainer";
export default function Page() {
	const {isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<main className="flex h-screen w-screen items-center justify-center">
			</main>
		);
	}
	return (
		
		<main className="flex h-screen w-screen flex-col items-center justify-center gap-y-5">
			<div className="flex max-w-[400px] flex-col items-center justify-center gap-y-5">
				<h1 className="text-4xl font-black">ClubKit</h1>
				<SignUp />
				{/* TODO: Add Explainer For Portal Accounts as a Dialog */}
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

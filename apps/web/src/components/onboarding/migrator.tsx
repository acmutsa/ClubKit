"use client";

import { doPortalLookupCheck, doPortalLink } from "@/actions/register/migrate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import c from "config";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

// mobile could be touched up a bit
export default function Migrator({ clerkEmail }: { clerkEmail: string }) {
	const [stage, setStage] = useState<
		"lookup" | "confirmation" | "notfound" | "success"
	>("lookup");
	const [legacyEmail, setLegacyEmail] = useState<string | null>(null);
	const [universityID, setUniversityID] = useState<string | null>(null);

	const {
		execute: runDoPortalLookup,
		result: portalLookupResult,
		status: portalLookupStatus,
		reset: resetPortalLookupAction,
	} = useAction(doPortalLookupCheck, {
		onSuccess({ data }) {
			toast.dismiss();
			if (data?.success) {
				setStage("confirmation");
			} else {
				setLegacyEmail(null);
				setUniversityID(null);
				setStage("notfound");
				resetPortalLookupAction();
			}
		},
		onError() {
			toast.error(
				`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
			);
		},
	});

	const { execute: runDoPortalLink, status: portalLinkStatus } = useAction(
		doPortalLink,
		{
			onSuccess() {
				toast.dismiss();
				setStage("success");
			},
			onError(error) {
				console.log("error: ", error);
				toast.error(
					`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
				);
			},
		},
	);

	function dbLookup() {
		if (
			!legacyEmail ||
			!universityID ||
			legacyEmail.length === 0 ||
			universityID.length === 0 ||
			universityID.length > c.universityID.maxLength
		) {
			toast.error("Please enter a valid email and university ID");
			return;
		}

		toast.loading("Looking up your portal account...");
		runDoPortalLookup({
			email: legacyEmail,
			universityID: universityID,
		});
	}

	return (
		<div className="grid min-h-[35vh] w-[850px] max-w-[100vw] grid-cols-2 rounded-xl border border-border shadow-xl">
			{stage === "lookup" && (
				<>
					<div className="flex h-full flex-col items-center justify-center px-8">
						<p className="max-w-[250px] text-center text-sm text-muted-foreground">
							Please enter the {c.universityID.name} and email
							address of your legacy portal account.
						</p>
					</div>
					<div className="flex h-full flex-col items-center justify-center px-8">
						<Label className="w-full">{c.universityID.name}</Label>
						<Input
							onChange={(e) =>
								setUniversityID(
									e.target.value && e.target.value.length > 0
										? e.target.value
										: null,
								)
							}
							className="mb-4 mt-1 w-full"
							placeholder={c.universityID.name}
							type="text"
							maxLength={c.universityID.maxLength}
						/>
						<Label className="w-full">Email</Label>
						<Input
							onChange={(e) =>
								setLegacyEmail(
									e.target.value && e.target.value.length > 0
										? e.target.value
										: null,
								)
							}
							className="mb-4 mt-1 w-full"
							placeholder="email@example.com"
							type="text"
						/>
						<Button
							className="w-full"
							onClick={dbLookup}
							disabled={portalLookupStatus === "executing"}
						>
							Find Portal Account
						</Button>
					</div>
				</>
			)}
			{stage === "confirmation" && (
				<div className="col-span-2 flex flex-col items-center justify-center gap-y-2">
					<h1 className="text-xl font-bold text-green-500">
						Account Found!
					</h1>
					<p>
						We found a Portal account under the name{" "}
						<b>{portalLookupResult.data?.name}</b>.
					</p>
					<Button
						className="my-5"
						disabled={portalLinkStatus === "executing"}
						onClick={() => {
							if (
								!legacyEmail ||
								!universityID ||
								legacyEmail.length === 0 ||
								universityID.length === 0 ||
								universityID.length > c.universityID.maxLength
							) {
								toast.error(
									`A state desync has occurred. Please try again or contact ${c.contactEmail}.`,
								);
								return;
							}
							toast.loading("Migrating your account...");
							runDoPortalLink({
								universityID: universityID,
								email: legacyEmail,
							});
						}}
					>
						Migrate Account
					</Button>
					{clerkEmail !== legacyEmail && (
						<p className="text-xs w-full text-center">
							⚠️The new email you signed in with (<span className="font-semibold">{clerkEmail}</span>) seems to differ from your legacy portal email (<span className="font-semibold">{legacyEmail}</span>). By clicking migrate account, you are acknowledging that the new portal account will be linked to <span className="font-semibold">{clerkEmail}</span>. ⚠️
						</p>
					)}
				</div>
			)}
			{stage === "notfound" && (
				<div className="col-span-2 flex flex-col items-center justify-center gap-y-2">
					<h1 className="text-xl font-bold text-red-500">
						Account Not Found.
					</h1>
					<p className="text-center">
						We could not find an account under the name.
						<br />
						Please try again, or if you believe this is an error,
						contact {c.contactEmail}.
					</p>
					<Button className="mt-5" onClick={() => setStage("lookup")}>
						Try Again
					</Button>
				</div>
			)}
			{/* if success is true, we want to allow the user to check over all of the data that they have entered and make any changes */}
			{stage === "success" && (
				<div className="col-span-2 flex flex-col items-center justify-center gap-y-2">
					<h1 className="text-xl font-bold text-green-500">
						Your Account Has Been Successfully Migrated!
					</h1>
					<p>Click the button below to go to the Dashboard.</p>
					<Link className="mt-5" href="/dash">
						<Button>Go to Dashboard</Button>
					</Link>
				</div>
			)}
		</div>
	);
}

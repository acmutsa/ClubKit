"use client";

import { doPortalLookupCheck } from "@/actions/register/migrate";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";

export default function Stage1() {
	const { execute, result } = useAction(doPortalLookupCheck);

	return (
		<div className="mt-20">
			<p>cha cha real smooth</p>
			<Button
				onClick={() => {
					execute({
						email: "liam@murray.to",
						universityID: "kzc596",
					});
				}}
			>
				Check
			</Button>
			{result.data !== undefined ? (
				<p>{result.data.success ? result.data.data : "did not find a user"}</p>
			) : (
				<p>no data</p>
			)}
		</div>
	);
}

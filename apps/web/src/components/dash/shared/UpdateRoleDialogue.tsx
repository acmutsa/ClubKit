"use client";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateMemberRole } from "@/actions/member";
import c from "config";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MemberType } from "@/lib/types/shared";
import { useRouter } from "next/navigation";

export default function UpdateRoleDialogue({
	userID,
	currentRole,
	setOpen,
}: {
	userID: number;
	currentRole: MemberType;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [role, setRole] = useState(currentRole);
	const { refresh } = useRouter();
	const { execute: runUpdateMemberRole, status } = useAction(
		updateMemberRole,
		{
			onSuccess: () => {
				setOpen(false);
				toast.dismiss();
				toast.success("Role updated");
				refresh();
			},
			onError: (err) => {
				toast.dismiss();
				if (
					err.error.validationErrors?._errors?.[0] ===
					"Unauthorized (Not a super admin)"
				) {
					return toast.error(
						"You need super admin permissions to update roles",
					);
				}
				toast.error("Failed to update role");
			},
		},
	);
	const isLoading = status === "executing";
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update Member Role</DialogTitle>
				<DialogDescription>
					{`Note: Only those with super admin permissions can update roles. If you need this permission, please reach out ${c.contactEmail}`}
				</DialogDescription>
			</DialogHeader>
			<Select
				onValueChange={(v) => setRole(v as MemberType)}
				defaultValue={role}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a Role" />
				</SelectTrigger>
				<SelectContent>
					{c.memberRoles.map((role) => {
						return (
							<SelectItem key={role} value={role}>
								{role}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
			<DialogFooter>
				<Button
					onClick={() => {
						if (role === currentRole) {
							return toast.error("Choose a different role");
						}
						toast.dismiss();
						toast.loading("Updating role...");
						runUpdateMemberRole({ userID, role });
					}}
					disabled={isLoading}
				>
					Update
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

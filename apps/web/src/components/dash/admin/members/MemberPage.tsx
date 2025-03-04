"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
	AccountInfo,
	PersonalInfo,
} from "@/components/dash/admin/members/ServerSections";
import UpdateRoleDialogue from "@/components/dash/shared/UpdateRoleDialogue";
import { Dialog } from "@/components/ui/dialog";
import { getUser } from "@/lib/queries/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type userType = NonNullable<Awaited<ReturnType<typeof getUser>>>;

interface MemberPageProps {
	user: userType;
	clerkUserImage?: string;
}

export default async function MemberPage({
	user,
	clerkUserImage,
}: MemberPageProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<UpdateRoleDialogue
				userID={user.userID}
				currentRole={user.role}
				setOpen={setOpen}
			/>
			<div className="mb-5 grid w-full grid-cols-3">
				<div className="flex items-center">
					<div>
						<h2 className="flex items-center gap-x-2 text-3xl font-bold tracking-tight">
							<Info />
							User Info
						</h2>
					</div>
				</div>
				<div className="col-span-2 flex items-center justify-end gap-2">
					<Link href={`mailto:${user.email}`}>
						<Button variant={"outline"}>Email Hacker</Button>
					</Link>
					<Button variant={"outline"} onClick={() => setOpen(true)}>
						Update Role
					</Button>
				</div>
			</div>
			<div className="mt-20 grid min-h-[500px] w-full grid-cols-3">
				<div className="flex h-full w-full max-w-[250px] flex-col items-center">
					<div className="relative aspect-square h-min w-full rounded-full">
						<Avatar className="h-full w-full object-cover object-center">
							<AvatarImage
								src={
									clerkUserImage
										? clerkUserImage
										: "/img/logos/acm.svg"
								}
							/>
							<AvatarFallback>
								Profile Photo for {user.firstName}
								{user.lastName}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="mt-4 flex flex-row items-center gap-x-2">
						<h1 className="text-3xl font-semibold">
							{user.firstName}
						</h1>
						<h1 className="text-3xl font-semibold">
							{user.lastName}
						</h1>
					</div>
					<h2 className="font-mono text-muted-foreground">
						{user.universityID}
					</h2>
					<Badge className={"no-select mt-4"}>{user.role}</Badge>
					<Badge className="no-select mt-4">
						Joined{" "}
						{user.joinDate
							.toDateString()
							.split(" ")
							.slice(1)
							.join(" ")}
					</Badge>
				</div>
				<div className="col-span-2 overflow-x-hidden">
					<PersonalInfo user={user} />
					<AccountInfo user={user} />
				</div>
			</div>
		</Dialog>
	);
}

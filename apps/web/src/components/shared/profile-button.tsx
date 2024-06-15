import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { DropdownSwitcher } from "@/components/shared/theme-switcher";
import { User } from "@clerk/nextjs/server";
type ProfileButtonProps = {
	clerkUser: User | null;
	clerkAuth: { userId: string | null };
	user: any;
};

export default async function ProfileButton({
	clerkUser,
	clerkAuth,
	user,
}: ProfileButtonProps) {
	const { userId } = clerkAuth;
	if (!userId || !clerkUser) return null;

	if (!user) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-8 w-8 rounded-full"
					>
						<Avatar className="h-8 w-8">
							<AvatarImage src={clerkUser?.imageUrl} alt={""} />
							<AvatarFallback>
								{clerkUser?.firstName && clerkUser?.lastName
									? clerkUser?.firstName.charAt(0) +
										clerkUser?.lastName.charAt(0)
									: "NA"}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="mt-2 w-56"
					align="end"
					forceMount
				>
					<DropdownMenuGroup>
						<DropdownSwitcher />
						<Link href={`/register`}>
							<DropdownMenuItem className="cursor-pointer">
								Complete Registration
							</DropdownMenuItem>
						</Link>
						<Link href={`/bug-report`}>
							<DropdownMenuItem className="cursor-pointer">
								Report a Bug
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<SignOutButton>
						<DropdownMenuItem className="cursor-pointer hover:!bg-destructive">
							Log out
						</DropdownMenuItem>
					</SignOutButton>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full"
				>
					<Avatar className="h-8 w-8">
						<AvatarImage src={clerkUser?.imageUrl} alt="@shadcn" />
						<AvatarFallback>
							{user.firstName.charAt(0) + user.lastName.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{/* TODO: Replace with user.clubTag */}@
							{"<clubtag>"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownSwitcher />
					{/* TODO: Replace with user.clubTag */}
					<Link href={`/@${"<clubtag>"}`}>
						<DropdownMenuItem className="cursor-pointer">
							Profile
						</DropdownMenuItem>
					</Link>
					<Link href={`/bug-report`}>
						<DropdownMenuItem className="cursor-pointer">
							Report a Bug
						</DropdownMenuItem>
					</Link>
					<Link href={"/settings"}>
						<DropdownMenuItem className="cursor-pointer">
							Settings
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<SignOutButton>
					<DropdownMenuItem className="cursor-pointer hover:!bg-destructive">
						Log out
					</DropdownMenuItem>
				</SignOutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const runtime = "edge";

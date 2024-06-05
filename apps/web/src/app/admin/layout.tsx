import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import FullScreenMessage from "@/components/shared/fullscreen-message";
import DashNavItem from "@/components/dash/shared/DashNavItem";
import ClientToast from "@/components/shared/client-toast";
import { Button } from "@/components/ui/button";
import c from "config";
import { Home } from "lucide-react";
import { Suspense } from "react";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect("/sign-in");
	}

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
		console.log("Denying admin access to user", user);
		return (
			<FullScreenMessage
				title="Access Denied"
				message="You are not an admin. If you belive this is a mistake, please contact a administrator."
			/>
		);
	}
	return (
		<>
			<ClientToast />
			<div className="fixed z-20 grid h-16 w-full grid-cols-2 bg-nav px-5">
				<div className="flex items-center gap-x-4 bg-nav">
					<Image
						src={c.icon.svg}
						alt={c.clubName + " Logo"}
						width={32}
						height={32}
					/>
					<div className="h-[45%] w-[2px] rotate-[25deg] bg-muted-foreground" />
					<h2 className="font-bold tracking-tight">Admin</h2>
				</div>
				<div className="hidden items-center justify-end md:flex">
					<Link href={"/"}>
						<Button
							className="bg-nav text-nav-content hover:bg-nav-content/70 hover:text-nav-content/70"
							size={"icon"}
						>
							<Home />
						</Button>
					</Link>
				</div>
			</div>
			<div className="fixed z-20 mt-16 flex h-12 w-full border-b bg-nav px-5">
				{Object.entries(c.dashPaths.admin).map(([name, path]) => {
					return <DashNavItem key={name} name={name} path={path} />;
				})}
			</div>
			<Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
		</>
	);
}

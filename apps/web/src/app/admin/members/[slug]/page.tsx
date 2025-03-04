import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getAdminUser, getUser } from "@/lib/queries/users";
import MemberPage from "@/components/dash/admin/members/MemberPage";

export default async function Page({ params }: { params: { slug: string } }) {
	const { userId } = auth();

	if (!userId) return notFound();

	const admin = await getAdminUser(userId);
	if (!admin) return notFound();

	const user = await getUser(params.slug);

	if (!user) {
		return <p className="text-center font-bold">User Not Found</p>;
	}

	let clerkUser = undefined;
	let imageUrl: string | undefined = undefined;
	if (user.clerkID) clerkUser = await clerkClient.users.getUser(user.clerkID);
	if (clerkUser) imageUrl = clerkUser.imageUrl;

	return (
		<main className="mx-auto max-w-5xl pt-44">
			<MemberPage user={user} clerkUserImage={imageUrl} />
		</main>
	);
}

export const runtime = "edge";

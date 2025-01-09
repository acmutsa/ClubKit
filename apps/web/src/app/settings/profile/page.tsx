import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSettings } from "@/lib/queries/user-settings";
import { clerkClient } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { ChangeResumeForm } from "@/components/settings/forms/change-resume-form";
import { ChangeProfilePictureForm } from "@/components/settings/forms/change-profile-picture-form";

export default async function ProfilePage() {
	const { userId } = auth();
	if (!userId) return redirect("/sign-up");

	const userSettings = await getUserSettings(userId);
	if (!userSettings) return redirect("/onboarding");

	const user = await clerkClient.users.getUser(userId);

	const params = new URLSearchParams({
		height: "112",
		width: "112",
		quality: "100",
		fit: "crop"
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-4xl font-bold">Profile</h1>
				<p className="text-muted-foreground">
					Update your profile information
				</p>
			</div>
			<Separator />
			<div className="lg:space-y-8 space-y-12">
				<ChangeProfilePictureForm
					profilePicture={user.hasImage ? `${user.imageUrl}?${params.toString()}` : undefined}
				/>
				<ChangeResumeForm
					resume={userSettings.data.resume ?? undefined}
				/>
			</div>
		</div>

	)
}

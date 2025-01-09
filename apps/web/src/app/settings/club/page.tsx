import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSettings } from "@/lib/queries/user-settings";
import { ClubSettingsForm } from "@/components/settings/forms/club-settings-form";

export default async function ClubSettingsPage() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-up");

	const userSettings = await getUserSettings(userId);

	if (!userSettings) return redirect("/onboarding");

	return (
		<ClubSettingsForm
			shirtType={userSettings.data.shirtType}
			shirtSize={userSettings.data.shirtSize}
		/>
	);
}

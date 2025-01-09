import { SchoolSettingsForm } from "@/components/settings/forms/school-settings-form";
import { getUserSettings } from "@/lib/queries/user-settings";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserSettingsProfilePage() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-up");

	const userSettings = await getUserSettings(userId);

	if (!userSettings) return redirect("/onboarding");

	return <SchoolSettingsForm 
		major={userSettings.data.major} 
		classification={userSettings.data.classification}  
		graduationYear={userSettings.data.graduationYear}
		graduationMonth={userSettings.data.graduationMonth}
	/>;
}

import { AccountSettingsForm } from "@/components/settings/forms/account-settings-form";
import { getUserSettings } from "@/lib/queries/user-settings";
import { Gender, Ethnicity } from "@/lib/types/settings";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserSettingsProfilePage() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-up");

	const userSettings = await getUserSettings(userId);

	if (!userSettings) return redirect("/onboarding");

	return (
		<AccountSettingsForm
			firstName={userSettings.firstName}
			lastName={userSettings.lastName}
			gender={userSettings.data.gender as Gender[]}
			ethnicity={userSettings.data.ethnicity as Ethnicity[]}
			// BUG: Birthday's marked return type is Date but ORM returns string instead, seems like an issue with drizzle.
			birthday={userSettings.data.birthday as unknown as string}
		/>
	);
}

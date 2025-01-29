import { AccountSettingsForm } from "@/components/settings/forms/account-settings-form";
import { ChangeProfilePictureForm } from "@/components/settings/forms/change-profile-picture-form";
import { ChangeResumeForm } from "@/components/settings/forms/change-resume-form";
import { ClubSettingsForm } from "@/components/settings/forms/club-settings-form";
import { SchoolSettingsForm } from "@/components/settings/forms/school-settings-form";
import { getUserSettings } from "@/lib/queries/user-settings";
import {
	GenderType,
	EthnicityType,
	ShirtSizeType,
	ShirtType,
	ClassificationType,
	MajorType,
} from "@/lib/types/shared";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default async function UserSettingsProfilePage() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-up");

	const userSettings = await getUserSettings(userId);

	if (!userSettings) return redirect("/onboarding");

	const user = await clerkClient.users.getUser(userId);

	const params = new URLSearchParams({
		height: "112",
		width: "112",
		quality: "100",
		fit: "crop",
	});

	return (
		<div className="flex flex-col gap-10">
			<Card id="account">
				<CardHeader>
					<CardTitle className="text-4xl">Account</CardTitle>
					<CardDescription className="text-md">
						View and change your account details
					</CardDescription>
				</CardHeader>
				<div className="mb-5 px-6">
					<Separator />
				</div>
				<CardContent>
					<AccountSettingsForm
						firstName={userSettings.firstName}
						lastName={userSettings.lastName}
						gender={userSettings.data.gender as GenderType[]}
						ethnicity={
							userSettings.data.ethnicity as EthnicityType[]
						}
						birthday={userSettings.data.birthday ?? undefined}
					/>
				</CardContent>
				<CardFooter />
			</Card>

			<Card id="profile">
				<CardHeader>
					<CardTitle className="text-4xl">Profile</CardTitle>
					<CardDescription className="text-md">
						Update your profile information
					</CardDescription>
				</CardHeader>
				<div className="mb-5 px-6">
					<Separator />
				</div>
				<CardContent className="space-y-12">
					<ChangeProfilePictureForm
						profilePicture={`${user.imageUrl}?${params.toString()}`}
					/>
					<ChangeResumeForm
						resume={userSettings.data.resume ?? undefined}
					/>
				</CardContent>
				<CardFooter />
			</Card>

			<Card id="club">
				<CardHeader>
					<CardTitle className="text-4xl">Club</CardTitle>
					<CardDescription className="text-md">
						Edit your club related settings here
					</CardDescription>
				</CardHeader>
				<div className="mb-5 px-6">
					<Separator />
				</div>
				<CardContent>
					<ClubSettingsForm
						shirtSize={userSettings.data.shirtSize as ShirtSizeType}
						shirtType={userSettings.data.shirtType as ShirtType}
					/>
				</CardContent>
				<CardFooter />
			</Card>

			<Card id="school">
				<CardHeader>
					<CardTitle className="text-4xl">School</CardTitle>
					<CardDescription className="text-md">
						Edit your existing academic information
					</CardDescription>
				</CardHeader>
				<div className="mb-5 px-6">
					<Separator />
				</div>
				<CardContent>
					<SchoolSettingsForm
						classification={
							userSettings.data
								.classification as ClassificationType
						}
						graduationMonth={userSettings.data.graduationMonth}
						graduationYear={userSettings.data.graduationYear}
						major={userSettings.data.major as MajorType}
					/>
				</CardContent>
				<CardFooter />
			</Card>
		</div>
	);
}

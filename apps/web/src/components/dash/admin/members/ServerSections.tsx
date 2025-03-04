import UserInfoSection from "@/components/dash/admin/members/UserInfoSection";
import type { userType } from "@/components/dash/admin/members/MemberPage";
import Link from "next/link";

interface PersonalInfoProps {
	user: userType;
}

export function PersonalInfo({ user }: PersonalInfoProps) {
	return (
		<UserInfoSection title="Personal Info">
			<div className="flex flex-wrap gap-x-10 gap-y-5">
				<Cell title="First Name" value={user.firstName} />
				<Cell title="Last Name" value={user.lastName} />
				<Cell
					title="Gender"
					value={
						user.data.gender.length !== 0
							? user.data.gender.join(",").toLowerCase()
							: "N/A"
					}
				/>
				<Cell
					title="Ethnicity"
					value={
						user.data.ethnicity.length !== 0
							? user.data.ethnicity.join(",")
							: "N/A"
					}
				/>
				<Cell title={"Major"} value={user.data.major} />
				<Cell
					title={"Classification"}
					value={user.data.classification}
				/>
				<Cell
					title={"Graduation"}
					value={
						user.data.graduationMonth +
						"/" +
						user.data.graduationYear
					}
				/>
				<Cell
					title={"Birthday"}
					value={
						user.data.birthday
							? user.data.birthday
									.toDateString()
									.split(" ")
									.slice(1)
									.join(" ")
							: "N/A"
					}
				/>
				<div>
					<p className={"whitespace-nowrap font-bold"}>Resume</p>
					{user.data.resume ? (
						<Link
							className={
								"whitespace-nowrap underline hover:text-blue-400"
							}
							href={user.data.resume}
						>
							View User Resume
						</Link>
					) : (
						<p className={"whitespace-nowrap"}>N/A</p>
					)}
				</div>
			</div>
		</UserInfoSection>
	);
}

interface AccountInfoProps {
	user: userType;
}

export function AccountInfo({ user }: AccountInfoProps) {
	return (
		<UserInfoSection title="Account Info">
			<div className="flex flex-wrap gap-x-10 gap-y-5">
				<Cell title="Email" value={user.email} />
				<Cell title="User ID" value={user.userID} />
				<Cell
					title="Clerk ID"
					value={user.clerkID ?? "Account not connected."}
				/>
			</div>
		</UserInfoSection>
	);
}

function Cell({
	title,
	value,
}: {
	title: string;
	value: string | number | boolean;
}) {
	return (
		<div>
			<p className="whitespace-nowrap font-bold">{title}</p>
			<p className="whitespace-nowrap">{value.toString()}</p>
		</div>
	);
}

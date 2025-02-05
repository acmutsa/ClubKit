import { createPrompt } from "bun-promptx";
import { z } from "zod";
import { db } from "db";
import { data, users } from "db/schema";

async function move() {
	const url = createPrompt("Enter Get All Users URL: ");
	if (url.error || !url.value) {
		console.error(url.error);
		return process.exit(1);
	}

	const username = createPrompt("Enter admin username: ");
	if (username.error || !username.value) {
		console.error(username.error);
		return process.exit(1);
	}
	const password = createPrompt("Enter password: ", { echoMode: "password" });
	if (password.error || !password.value) {
		console.error(password.error);
		return process.exit(1);
	}

	const req = await fetch(url.value, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			apikey: username.value + password.value,
		}),
	});

	const res = await req.json();

	const allMembers = res.allMembers;

	const memberValidator = z.object({
		id: z.string(),
		email: z.string().email(),
		name: z.string(),
		joinDate: z.string().pipe(z.coerce.date()),
		data: z.object({
			memberID: z.string(),
			major: z.string(),
			classification: z.string(),
			graduationDate: z.string(),
			shirtIsUnisex: z.boolean(),
			shirtSize: z.string(),
			Birthday: z.string().optional().nullable(),
			isInACM: z.boolean(),
			isInACMW: z.boolean(),
			isInRC: z.boolean(),
			isInICPC: z.boolean(),
			isInCIC: z.boolean(),
			isBlackorAA: z.boolean(),
			isAsian: z.boolean(),
			isNAorAN: z.boolean(),
			isNHorPI: z.boolean(),
			isHispanicorLatinx: z.boolean(),
			isWhite: z.boolean(),
			isMale: z.boolean(),
			isFemale: z.boolean(),
			isNonBinary: z.boolean(),
			isTransgender: z.boolean(),
			isIntersex: z.boolean(),
			doesNotIdentify: z.boolean(),
			otherIdentity: z.string().optional().nullable(),
			address: z.string().optional().nullable(),
		}),
		extendedMemberData: z.string(),
		lastSeen: z.string().optional().nullable(),
	});

	for (const member of allMembers) {
		const validatedMember = memberValidator.safeParse(member);
		if (validatedMember.success) {
			console.log(
				"Processing member: ",
				validatedMember.data.email + " | " + validatedMember.data.name,
			);
			const m = validatedMember.data;
			await db.transaction(async (tx) => {
				const newUserRecordResult = await tx
					.insert(users)
					.values({
						email: m.email,
						joinDate: m.joinDate,
						universityID: m.id,
						firstName: m.name
							.split(" ")
							.slice(0, -1)
							.join(" ")
							.trim(),
						lastName: m.name
							.split(" ")
							[m.name.split(" ").length - 1].trim(),
					})
					.returning({ id: users.userID });
				if (
					newUserRecordResult.length !== 1 ||
					!newUserRecordResult[0]
				) {
					await tx.rollback();
					console.error(
						`User creation failed for user (${m.id} / ${m.email})`,
					);
					return;
				}
				const newUserRecord = newUserRecordResult[0];
				const gender = [
					m.data.isMale ? "Male" : null,
					m.data.isFemale ? "Female" : null,
					m.data.isNonBinary ? "Non-binary" : null,
					m.data.isTransgender ? "Transgender" : null,
					m.data.isIntersex ? "Intersex" : null,
					m.data.doesNotIdentify ? "Prefer not to say" : null,
					m.data.otherIdentity ? "Other" : null,
				].filter((x) => x !== null) as string[];

				const ethnicity = [
					m.data.isBlackorAA ? "Black or African American" : null,
					m.data.isAsian ? "Asian" : null,
					m.data.isNAorAN ? "American Indian or Alaska Native" : null,
					m.data.isNHorPI
						? "Native Hawaiian or Other Pacific Islander"
						: null,
					m.data.isHispanicorLatinx ? "Hispanic or Latino" : null,
					m.data.isWhite ? "White" : null,
				].filter((x) => x !== null) as string[];

				let gradYear = 0;
				let gradMonth = 0;

				if (m.data.graduationDate.includes("-")) {
					gradYear = parseInt(m.data.graduationDate.split("-")[0]);
					gradMonth = parseInt(m.data.graduationDate.split("-")[1]);
				} else if (m.data.graduationDate.includes("/")) {
					gradYear = parseInt(m.data.graduationDate.split("/")[0]);
					gradMonth = parseInt(m.data.graduationDate.split("/")[1]);
				}

				await tx.insert(data).values({
					userID: newUserRecord.id,
					major: m.data.major,

					classification: m.data.classification,
					graduationMonth: gradMonth,
					graduationYear: gradYear,
					birthday: m.data.Birthday
						? new Date(m.data.Birthday)
						: null,
					gender: gender,
					ethnicity: ethnicity,
					resume: null,
					shirtType: m.data.shirtIsUnisex ? "Unisex" : "Women's",
					shirtSize: m.data.shirtSize,
					interestedEventTypes: [],
				});
			});
		} else {
			console.error("Member is invalid: ", member.id);
			console.log("due to error ", validatedMember.error);
		}
	}

	return process.exit(0);
}

move();

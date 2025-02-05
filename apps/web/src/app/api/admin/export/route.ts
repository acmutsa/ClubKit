import { db, desc } from "db";
import c from "config";
import { NextRequest, NextResponse } from "next/server";
import { ExportNames } from "@/lib/types/shared";
import { getClientTimeZone } from "@/lib/utils";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants";
import { formatInTimeZone } from "date-fns-tz";
import { getEventsWithCheckins } from "@/lib/queries/events";
import { getCheckinLog } from "@/lib/queries/checkins";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllSemesters } from "@/lib/queries/semesters";

const basicDateFormatterString = "eeee, MMMM dd yyyy HH:mm a";

function escape(value: any) {
	if (value === null) return "None";

	// convert to string if it's not already
	const stringValue =
		typeof value !== "string" ? JSON.stringify(value) : value;

	// escape double quotes and enclose in quotes if it contains comma, newline or double quote
	if (/[",\n]/.test(stringValue)) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}

	return stringValue;
}

function jsonToCSV(json: any[]): string {
	if (!Array.isArray(json) || json.length === 0) {
		return "";
	}

	const header = Object.keys(json[0]);
	let csv = json.map((row) =>
		header.map((fieldName) => escape(row[fieldName])).join(","),
	);
	csv.unshift(header.join(","));

	return csv.join("\r\n");
}

async function hanldExportRequest(
	exportName: ExportNames,
	tz: string,
): Promise<any[]> {
	switch (exportName as ExportNames) {
		case "members":
			const memberTableData =
				(await db.query.users.findMany({
					with: {
						data: true,
					},
				})) ?? [];
			return memberTableData.map((user) => {
				let toRet = {
					...user,
					...user.data,
					joinDate: formatInTimeZone(
						user.joinDate,
						tz,
						basicDateFormatterString,
					),
					birthday: user.data.birthday
						? formatInTimeZone(
								user.data.birthday,
								tz,
								"eeee, MMMM dd yyyy",
							)
						: "Not provided",
				};
				///@ts-ignore We know this breaks contract, but has been tested.
				delete toRet?.data;
				return toRet;
			});
		case "events":
			return (await getEventsWithCheckins()).map((event) => {
				return {
					id: event.id,
					name: event.name,
					description: event.description,
					points: event.points,
					location: event.location,
					event_start: formatInTimeZone(
						event.start,
						tz,
						basicDateFormatterString,
					),
					event_end: formatInTimeZone(
						event.end,
						tz,
						basicDateFormatterString,
					),
					event_checkin_start: formatInTimeZone(
						event.checkinStart,
						tz,
						basicDateFormatterString,
					),
					event_checkin_end: formatInTimeZone(
						event.checkinEnd,
						tz,
						basicDateFormatterString,
					),
					last_updated: formatInTimeZone(
						event.updatedAt,
						tz,
						basicDateFormatterString,
					),
					checkins: event.checkin_count,
				};
			});
		case "categories":
			return getAllCategories();
		case "checkins":
			// need to come back and flatten this one
			return (await getCheckinLog()).map((checkin) => {
				return {
					event_name: checkin.event.name,
					user:
						checkin.author.firstName +
						" " +
						checkin.author.lastName,
					checkin_time: formatInTimeZone(
						checkin.time,
						tz,
						basicDateFormatterString,
					),
					rating: checkin.rating ?? "No rating",
					feedback: checkin.feedback || "",
				};
			});
		case "semesters":
			return await getAllSemesters();
		default:
			return [];
	}
}

export async function GET(request: NextRequest) {
	const exportName = request.nextUrl.searchParams.get("name");
	if (!exportName) {
		return NextResponse.json(
			{ error: "No name provided" },
			{ status: 400 },
		);
	}
	const clientTimeZone = getClientTimeZone(
		request.headers.get(VERCEL_IP_TIMEZONE_HEADER_KEY),
	);
	const flattendedResults = await hanldExportRequest(
		exportName as ExportNames,
		clientTimeZone,
	);
	const csv = jsonToCSV(flattendedResults);

	const formattedDate = formatInTimeZone(
		new Date(),
		clientTimeZone,
		"MMMM_dd_yyyy_HH:mm:ss_a",
	);

	return new Response(csv, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename=${c.clubName}_${exportName}_export_${formattedDate}.csv`,
		},
	});
}

export const runtime = "edge";

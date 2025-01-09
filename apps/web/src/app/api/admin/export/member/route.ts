import { db } from "db";
import c from "config";

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

export async function GET() {
	const memberTableData =
		(await db.query.users.findMany({
			with: {
				data: true,
			},
		})) ?? [];

	const flattenedUsers = memberTableData.map((user) => {
		let toRet = {
			...user,
			...user.data,
		};
		///@ts-ignore We know this breaks contract, but has been tested.
		delete toRet?.data;
		return toRet;
	});

	const csv = jsonToCSV(flattenedUsers);

	// 	return new Response(csv, {
	// 		headers: {
	// 			"Content-Type": "text/csv",
	// 			"Content-Disposition": `attachment; filename=${c.clubName}_export_${new Date()
	// 				.toString()
	// 				.replaceAll(" ", "_")
	// 				.replaceAll("(", "")
	// 				.replaceAll(")", "")
	// 				.toLowerCase()}.csv`,
	// 		},
	// 	}
	// );
	return new Response("Hello World");
}

export const runtime = "edge";

import { db, eq, or, between, and, ne, desc } from "db";
import { semesters } from "db/schema";
import c from "config";

export async function getAllSemesters() {
	return db.query.semesters.findMany();
}

export async function getCurrentSemester() {
	return db.query.semesters.findFirst({
		where: eq(semesters.isCurrent, true),
	});
}

export async function resetCurrentSemesters(currentSemesterID: number) {
	await db
		.update(semesters)
		.set({
			isCurrent: false,
		})
		.where(
			and(
				eq(semesters.isCurrent, true),
				ne(semesters.semesterID, currentSemesterID),
			),
		);
}

export async function getExistingSemester(startDate: Date, endDate: Date) {
	return db.query.semesters.findFirst({
		where: or(
			between(semesters.startDate, startDate, endDate),
			between(semesters.endDate, startDate, endDate),
		),
	});
}

export async function getAllSemestersDesc() {
	return db.query.semesters.findMany({
		orderBy: desc(semesters.isCurrent),
	});
}

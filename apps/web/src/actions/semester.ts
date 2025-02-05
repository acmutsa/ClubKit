"use server";
import { db, eq } from "db";
import { semesters } from "db/schema";
import { executiveAction } from "@/lib/safe-action";
import {
	createSemesterSchema,
	toggleCurrentSemesterSchema,
	updateSemesterSchema,
} from "db/zod";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants";
import {
	SEMESTER_DATE_RANGE_EXISTS,
	SEMESTER_NAME_EXISTS,
} from "@/lib/constants/semesters";
import {
	resetCurrentSemesters,
	getExistingSemester,
} from "@/lib/queries/semesters";
import z from "zod";
import { revalidatePath } from "next/cache";

export const createNewSemester = executiveAction
	.schema(createSemesterSchema)
	.action(async ({ parsedInput }) => {
		const { startDate, endDate } = parsedInput;

		const existing = await getExistingSemester(startDate, endDate);

		if (existing) {
			return {
				success: false,
				code: SEMESTER_DATE_RANGE_EXISTS,
				semesterName: existing.name,
			};
		}

		try {
			const res = await db
				.insert(semesters)
				.values(parsedInput)
				.returning({ semesterID: semesters.semesterID });
			if (parsedInput.isCurrent) {
				await resetCurrentSemesters(res[0].semesterID);
			}
		} catch (e) {
			/// @ts-expect-error could not find the type of the error and the status code is the next most accurate way of telling an issue
			if (e.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE) {
				return {
					success: false,
					code: SEMESTER_NAME_EXISTS,
					semesterName: parsedInput.name,
				};
			}
			throw e;
		}
		revalidatePath("/admin/semesters");
		return {
			success: true,
		};
	});

export const updateSemester = executiveAction
	.schema(updateSemesterSchema)
	.action(async ({ parsedInput: dbInputs }) => {
		const { startDate, endDate, semesterID } = dbInputs;
		const existing = await getExistingSemester(startDate, endDate);
		if (existing && existing.semesterID !== semesterID) {
			return {
				success: false,
				code: SEMESTER_DATE_RANGE_EXISTS,
				semesterName: existing.name,
			};
		}

		try {
			await db
				.update(semesters)
				.set(dbInputs)
				.where(eq(semesters.semesterID, dbInputs.semesterID));
			if (dbInputs.isCurrent) {
				await resetCurrentSemesters(semesterID);
			}
		} catch (e) {
			/// @ts-expect-error could not find the type of the error and the status code is the next most accurate way of telling an issue
			if (e.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE) {
				return {
					success: false,
					code: SEMESTER_NAME_EXISTS,
					semesterName: dbInputs.name,
				};
			}
			throw e;
		}
		revalidatePath("/admin/semesters");
		return {
			success: true,
		};
	});

export const toggleCurrentSemester = executiveAction
	.schema(toggleCurrentSemesterSchema)
	.action(async ({ parsedInput }) => {
		const { semesterID, isCurrent } = parsedInput;
		if (isCurrent) {
			await resetCurrentSemesters(semesterID);
		}
		await db
			.update(semesters)
			.set({
				isCurrent,
			})
			.where(eq(semesters.semesterID, semesterID));

		revalidatePath("/admin/semesters");

		return {
			success: true,
		};
	});

export const deleteSemester = executiveAction
	.schema(z.number().int())
	.action(async ({ parsedInput: semesterID }) => {
		await db.delete(semesters).where(eq(semesters.semesterID, semesterID));
		revalidatePath("/admin/semesters");
		return {
			success: true,
		};
	});

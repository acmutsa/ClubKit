"use server";

import { userAction, adminAction } from "@/lib/safe-action";
import { userCheckinSchemaFormified } from "db/zod";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants/";
import { checkInUserClient, checkInUserList } from "@/lib/queries/checkins";
import { adminCheckinSchema, universityIDSplitter } from "db/zod";
import { CheckinResult } from "@/lib/types/events";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const { ALREADY_CHECKED_IN, SUCCESS, FAILED, SOME_FAILED } = CheckinResult;

export const checkInUserAction = userAction
	.schema(userCheckinSchemaFormified)
	.action(async ({ parsedInput }) => {
		try {
			await checkInUserClient(parsedInput);
		} catch (e) {
			///@ts-expect-error could not find the type of the error and the status code is the next most accurate way of telling an issue
			if (e.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE) {
				return {
					success: false,
					code: ALREADY_CHECKED_IN,
				};
			}
			throw e;
		}
		return {
			success: true,
			code: SUCCESS,
		};
	});

export const adminCheckin = adminAction
	.schema(adminCheckinSchema)
	.action(async ({ ctx, parsedInput }) => {
		const { universityIDs, eventID } = parsedInput;
		const { userID: adminID } = ctx;
		try {
			const currentPath = headers().get("referer") ?? "";

			const idList = universityIDSplitter.parse(universityIDs);
			const failedIDs = await checkInUserList(eventID, idList, adminID);

			revalidatePath(currentPath);
			if (failedIDs.length == 0) {
				return {
					success: true,
					code: SUCCESS,
				};
			} else if (failedIDs.length < idList.length) {
				return {
					success: false,
					code: SOME_FAILED,
					failedIDs,
				};
			} else if (failedIDs.length == idList.length) {
				return {
					success: false,
					code: FAILED,
				};
			}
			return {
				success: false,
				code: FAILED,
			};
		} catch (e) {
			return {
				success: false,
				code: FAILED,
			};
		}
	});

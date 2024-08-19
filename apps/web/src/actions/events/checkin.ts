"use server";

import { authenticatedAction, adminAction } from "@/lib/safe-action";
import { userCheckInSchemaFormified } from "@/validators/userCheckin";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants/";
import { checkInUser, checkInUserList } from "@/lib/queries";
import { AdminCheckin, adminCheckinSchema, universityIDSplitter } from "db/zod";
import { CheckinResult } from "@/lib/types/events";
export const checkInUserAction = authenticatedAction(
	userCheckInSchemaFormified,
	async ({ feedback, rating, userId, eventId }) => {
		try {
			await checkInUser(eventId, userId, feedback, rating);
		} catch (e) {
			///@ts-expect-error could not find the type of the error and the status code is the next most accurate way of telling an issue
			if (e.code === UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE) {
				return {
					success: false,
					code: CheckinResult.ALREADY_CHECKED_IN,
				};
			}
			throw e;
		}
		return {
			success: true,
			code: CheckinResult.SUCCESS,
		};
	},
);

export const adminCheckin = adminAction(
	adminCheckinSchema,
	async ({ eventID, universityIDs }: AdminCheckin, { adminID }) => {
		try {
			const idList = universityIDSplitter.parse(universityIDs);
			const failedIDs = await checkInUserList(
				eventID,
				idList,
				adminID.toString(),
			);

			if (failedIDs.length == 0) {
				return {
					success: true,
					code: CheckinResult.SUCCESS,
				};
			} else if (failedIDs.length < idList.length) {
				return {
					success: false,
					code: CheckinResult.SOME_FAILED,
					failedIDs,
				};
			} else if (failedIDs.length == idList.length) {
				return {
					success: false,
					code: CheckinResult.FAILED,
				};
			}
			return {
				success: false,
				code: CheckinResult.FAILED,
			};
		} catch (e) {
			return {
				success: false,
				code: CheckinResult.FAILED,
			};
		}
	},
);

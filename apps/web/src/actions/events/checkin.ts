"use server";

import { authenticatedAction, adminAction } from "@/lib/safe-action";
import { userCheckinSchemaFormified } from "db/zod";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants/";
import { checkInUserClient, checkInUserList } from "@/lib/queries/checkins";
import { AdminCheckin, adminCheckinSchema, universityIDSplitter } from "db/zod";
import { CheckinResult } from "@/lib/types/events";

const { ALREADY_CHECKED_IN, SUCCESS, FAILED, SOME_FAILED } = CheckinResult;

export const checkInUserAction = authenticatedAction(
	userCheckinSchemaFormified,
	async ({ feedback, rating, userID, eventID }) => {
		try {
			await checkInUserClient({ eventID, userID, feedback, rating });
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
	},
);

"use server";

import { authenticatedAction, adminAction } from "@/lib/safe-action";
import { userCheckInSchemaFormified } from "@/validators/userCheckin";
import { checkInUser, checkInUserList } from "@/lib/queries";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants/shared";
import { adminCheckinSchema, universityIDSplitter } from "db/zod";
import { fail } from "assert";
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
					code: "You have already checked in",
				};
			}
			throw e;
		}
		return {
			success: true,
			code: "success",
		};
	},
);

export const adminCheckin = adminAction(
	adminCheckinSchema,
	async ({ eventID, universityIDs, adminID }) => {
		try {
			const idList = universityIDSplitter.parse(universityIDs);
			const successfulIDs = await checkInUserList(
				eventID,
				idList,
				adminID,
			);
			if (successfulIDs.length == 0) {
				return {
					success: false,
					code: "no_checkins_made",
				};
			} else if (idList.length == successfulIDs.length) {
				return {
					success: true,
					code: "success",
				};
			} else if (idList.length > successfulIDs.length) {
				return {
					success: false,
					code: "some_checkins_failed",
					failedIDs: idList.filter(
						(successfulID) =>
							!successfulIDs.includes({
								successfulID: Number.parseInt(successfulID),
							}),
					),
				};
			}
			return {
				success: false,
				code: "some_checkins_failed",
				failedIDs: idList.filter(
					(successfulID) =>
						!successfulIDs.includes({
							successfulID: Number.parseInt(successfulID),
						}),
				),
			};
		} catch (e) {
			return {
				success: false,
				code: "checkin_insertion_failed",
			};
		}
	},
);

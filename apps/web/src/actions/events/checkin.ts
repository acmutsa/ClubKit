"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { userCheckInSchemaFormified } from "@/validators/userCheckin";
import { checkInUser } from "@/lib/queries";
import { UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE } from "@/lib/constants/shared";

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
		}
);

<<<<<<< HEAD
"use server"

import { db } from "db";
import { authenticatedAction } from "@/lib/safe-action";
import { userCheckInSchemaFormified } from "@/validators/userCheckin";
import { resolve } from "path";
import { getUserCheckin } from "@/lib/queries";
import { checkins, users } from "db/schema";

export const checkInUser = authenticatedAction(
userCheckInSchemaFormified,
async({feedback,rating,userId,eventId})=>{
    // await new Promise(resolve=>setTimeout(resolve,1500));
    console.log("Checking in user!");
    console.log(feedback,rating);

    const userCheckin = await getUserCheckin(eventId,userId);

    if (userCheckin){
        throw new Error("You have already checked in!");
    }

    const checkedInUser = await db.insert(checkins).values({
        userID:userId,
        eventID:eventId,
        rating,
        feedback
    }).returning({checkInTime:checkins.time});

    return {
        success:true,
        code:"success"
    }
}
)
=======
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
>>>>>>> dev

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

    console.log("Successfully checked in for ",checkedInUser);

    return {
        success:true,
        code:"success"
    }
}
)

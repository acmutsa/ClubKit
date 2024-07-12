"use server"

import { db } from "db";
import { authenticatedAction } from "@/lib/safe-action";
import { userCheckInSchemaFormified } from "@/validators/userCheckin";
import { resolve } from "path";

export const checkInUser = authenticatedAction(
userCheckInSchemaFormified,
async({feedback,rating,userId,eventId})=>{
    await new Promise(resolve=>setTimeout(resolve,1500));
    console.log("Checking in user!");
    console.log(feedback,rating);
    // throw new Error("Just a test error");
    return {
        success:true,
        code:"success"
    }
}
)

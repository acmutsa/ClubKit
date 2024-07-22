"use server"

import { authenticatedAction } from "@/lib/safe-action";
import { userCheckInSchemaFormified } from "@/validators/userCheckin";
import { checkInUser } from "@/lib/queries";
import { UserHasCheckedInError } from "@/lib/constants/events";
export const checkInUserAction = authenticatedAction(
    userCheckInSchemaFormified,
    async({feedback,rating,userId,eventId})=>{

        try{
            await checkInUser(eventId,userId,feedback,rating);
        }
        catch(e){
            if (e instanceof UserHasCheckedInError){
                return {
                    success:false,
                    code:e.message
                }
            }
            throw e;
        }

        return {
            success:true,
            code:"success"
        }
    }
)

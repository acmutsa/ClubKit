import z from "zod";
import c from "config"

export const userCheckinSchema = z.object({
    feedback:z.string().max(c.maxCheckinDescriptionLength, { message: "Feedback must be 400 characters or less." }),
    rating:z.number().int().min(1,{message:"Please provide a rating."}).max(5)
});
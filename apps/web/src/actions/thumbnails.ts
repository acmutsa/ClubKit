"use server"
import { adminAction } from "@/lib/safe-action"
import { createThumbnailSchema } from "db/zod"
import { db } from "db"
import { revalidatePath } from "next/cache"
import { thumbnails } from "db/schema"
import { del } from "@/lib/server/file-upload";

export const createThumbnailAction = adminAction.schema(createThumbnailSchema).action(async ({parsedInput}) => {
  try{
    await db.insert(thumbnails).values(parsedInput)

  revalidatePath("/admin/thumbnails");
  revalidatePath("/admin/events/new")
  }
  catch(e){
    await del(parsedInput.url)
    throw e
  }
})

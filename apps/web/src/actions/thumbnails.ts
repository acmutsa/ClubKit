"use server"
import { adminAction } from "@/lib/safe-action"
import { createThumbnailSchema } from "db/zod"
import { db, eq} from "db"
import { revalidatePath } from "next/cache"
import { thumbnails, events } from "db/schema"
import { del } from "@/lib/server/file-upload";
import z from "zod"


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

export const deleteThumbnailAction = adminAction
  .schema(createThumbnailSchema)
  .action(async ({ parsedInput  }) => {
    await Promise.all([
      runDeleteThumbnail(parsedInput.url),
      db.delete(thumbnails).where(eq(thumbnails.id, parsedInput.id!)),
    ])

    revalidatePath("/admin/thumbnails")
    revalidatePath("/admin/events/new")

    return {
      success:true,
      name:parsedInput.name
    }
  }
)

async function runDeleteThumbnail(url:string){
  const res = await db.query.events.findFirst({
    where:eq(events.thumbnailUrl,url )
  })
  if (!res){
    await del(url);
  }
}

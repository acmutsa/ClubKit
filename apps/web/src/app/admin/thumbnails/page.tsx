import { getAllThumbnails } from "@/lib/queries/thumbnails";
import ThumbnailViewClient from "@/components/dash/admin/thumbnails/ThumbnailViewClient";
export default async function Page() {
  const thumbnails = await getAllThumbnails();
  return (
    <div className="mx-auto max-w-6xl pt-4 text-foreground">
      <div className="mb-5 grid grid-cols-2 px-5">
        <h1 className="font-foreground text-3xl font-bold tracking-tight">
          Thumbnails
        </h1>
      </div>
      <div className="px-5">
        <ThumbnailViewClient allThumbnails={thumbnails} />
      </div>
    </div>
  );
}

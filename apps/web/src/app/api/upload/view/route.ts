import { getPresignedViewingUrl } from "@/lib/server/s3";
import { redirect } from "next/navigation";
import { staticUploads } from "config";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
	const { userId } = await auth();
	const referPath = headers().get("referer") ?? "";
	if (!userId && !referPath.includes("events")) {
		return new Response("You must be logged in to access this resource", {
			status: 401,
		});
	}

	const key = new URL(request.url).searchParams.get("key");
	if (!key) {
		return new Response(
			"Request must have a query parameter 'key' associated with it",
			{
				status: 400,
			},
		);
	}

	const decodedKey = decodeURIComponent(key);

	// Presign the url and return redirect to it.
	const presignedViewingUrl = await getPresignedViewingUrl(
		staticUploads.bucketName,
		decodedKey,
	);

	return redirect(presignedViewingUrl);
}

export const runtime = "edge";

import { NextRequest } from "next/server";
import { getEventById } from "@/lib/queries/events";
import { ics} from "calendar-link"

export async function GET(request: NextRequest) {
  const eventID = request.nextUrl.searchParams.get("event_id");
  if (!eventID) {
    return new Response("Missing event_id", { status: 400 });
  }
  const event = await getEventById(eventID);
  if (!event) {
    return new Response("Event not found", { status: 404 });
  }
  const cal = ics({
    title: event.name,
    description: event.description,
    start: event.start,
    end: event.end,
    location: event.location,
  });
  return new Response(cal, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename=${event.name}.ics`,
    },
  });




}
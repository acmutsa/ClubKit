import NewEventForm from "@/components/dash/admin/events/NewEventForm";

export default function Page() {
  const defaultDate = new Date();
  return (
    <div className="text-foreground pt-44 mx-auto max-w-6xl">
      <div className="grid grid-cols-2">
        <h1 className="font-foreground font-bold tracking-tight text-3xl">
          New Event
        </h1>
      </div>
      <div className="border border-muted rounded-xl p-5">
        <NewEventForm defaultDate={defaultDate} />
      </div>
    </div>
  );
}

export const runtime = "edge";

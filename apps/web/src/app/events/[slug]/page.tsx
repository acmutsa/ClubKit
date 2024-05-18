import EventDetails from "@/components/events/EventDetails";

export default function Page({ params }: { params: { slug: string } }) {
  return <EventDetails id={params.slug} />;
}
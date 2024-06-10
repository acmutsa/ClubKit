import EventDetails from "@/components/events/EventDetails";

export default async function Page({ params }: { params: { slug: string } }) {
  return <EventDetails id={params.slug} />;
}
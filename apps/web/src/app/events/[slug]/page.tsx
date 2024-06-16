import EventDetails from "@/components/events/EventDetails";
import Navbar from "@/components/shared/navbar";
export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <EventDetails id={params.slug} />
    </div>
  );
}
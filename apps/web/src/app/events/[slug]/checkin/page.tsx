import EventsCheckin from "@/components/events/EventCheckin";
import Navbar from "@/components/shared/navbar";

export default function Page({params}: {params: {slug: string}}){
    
    return (
		<div className="flex h-[100dvh] w-full flex-col">
			<Navbar />
			<EventsCheckin id={params.slug} />
		</div>
    );
}   

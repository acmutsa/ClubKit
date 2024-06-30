import { getEventDetails } from "@/lib/queries";
import NotFound from "../../shared/NotFound";
import EventDetailsMobile from "./EventDetailsMobile";
import EventDetailsDefault from "./EventDetailsDefault";


export default async function EventDetails({id}:{id:string}) {
  
  const event = await getEventDetails(id);
    
  if (!event){
    return <NotFound message="Event Not Found" href='/events' />;
  }
  

  // Also, we should display how many points something is worth to entice people to show up for it 
  return (
		<div className="mt-2 flex flex-1 flex-col space-y-4 pb-20">
			<h1 className=" py-1 px-2 text-center text-2xl font-black sm:text-2xl md:text-3xl lg:text-5xl">
				{event.name}
			</h1>
			<EventDetailsMobile event={event} />
			<EventDetailsDefault event={event} />
		</div>
  );
}

import { db,eq } from "db";
import { events } from "db/schema";
import c from "config";


export default async function EventDetails({id}:{id:string}) {
  const aboutACM ="ACM is the premier organization on campus for students interested in technology. ACM is dedicated to providing members with opportunities for professional, academic, and social growth outside the classroom in order to prepare students for their career in tech or fuel their interest in the tech field. Anyone who has an interest in technology can join ACM.";
  const checkingIn = 'The membership portal is ACM\'s new method of tracking member check-ins and awarding points. By simply visiting this page during the event and clicking the Check-in button, you can easily garner points towards your membership for the semester.Share this event\'s check-in page quickly using this QR Code:'

  const event = await db.query.events.findFirst({ 
    where:eq(events.id,id)
  });

  if (!event){
    return <EventNotFound/>;
  }

  // Also, we should display how many points something is worth to entice people to show up for it 
  return (
      <div className="flex flex-1 flex-col mt-2">
        <h1 className="font-black text-center border-b sm:text-xl md:text-3xl">{event.name} </h1>
      </div>
    );
}

const EventNotFound = () =>{

  return (
		<div className="flex w-full flex-1 flex-col items-center justify-center space-y-5">
			<h1 className="text-6xl font-black">Event Not Found</h1>
			<a href={`mailto:${c.contactEmail}`}>
				{`If you think this is a mistake, please email: ${c.contactEmail}`}
			</a>
		</div>
  );

}
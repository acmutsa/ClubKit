import { db } from "db";


export default async function EventDetails({id}:{id:string}) {
  const aboutACM ="ACM is the premier organization on campus for students interested in technology. ACM is dedicated to providing members with opportunities for professional, academic, and social growth outside the classroom in order to prepare students for their career in tech or fuel their interest in the tech field. Anyone who has an interest in technology can join ACM.";
  const checkingIn = 'The membership portal is ACM\'s new method of tracking member check-ins and awarding points. By simply visiting this page during the event and clicking the Check-in button, you can easily garner points towards your membership for the semester.Share this event\'s check-in page quickly using this QR Code:'
  
  
  // Also, we should display how many points something is worth to entice people to show up for it 
  return (
      <div>
        <h1>Event Details of id: {id} </h1>
      </div>
    );
  
}
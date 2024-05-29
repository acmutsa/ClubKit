import EventsView from "./EventsView";
import { db,desc,eq, sql } from "db";
import {eventCategories, events, eventsToCategories, } from "db/schema";
import Navbar from "../shared/Navbar";
import EventsTitle from "./EventsTitle";


type EventsToCategories = {
  eventID: string;
  categoryID: string
  category:{
    name:string;
    color:string;
 }
}

export type EventType = {
  id: string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  checkinStart: Date;
  checkinEnd: Date;
  location: string;
  isUserCheckinable: boolean;
  isHidden: boolean;
  eventsToCategories: Array<EventsToCategories> ;
}

type EventsType = {
  eventDate:string;
  events:EventType[];
}

type SearchParams = 
  { [key: string]: string | undefined };


export async function getEventData(searchParams:SearchParams){
  console.log(searchParams)
  const eventsPromise = db.query.events.findMany({
    with:{
      eventsToCategories:{
        with:{
          category:{
            columns:{
              name:true,
              color:true
            }
          }
        }
      }
    },
    // This will give us our most recent events first. This will be useful for how we sort
    orderBy:events.start
  });

  const categoriesPromise = db.query.eventCategories.findMany();
  // Resolve all the promises concurrently to speed up requests
  const [eventResults,categories] = await Promise.all([eventsPromise,categoriesPromise]);
  
  
  // const dateBuckets = eventsResults.reduce((acc, event) => {
  //   const key = event.start.toLocaleDateString();
  //   console.log(event.start);
  //   console.log('key:',key)
  //   if (!acc[key]){
  //     acc[key] = [];
  //   }
  //   acc[key].push(event);
  //   return acc;
  // }, {} as Record<string, EventType[]>);
  
  // const eventsAsArray = Object.entries(dateBuckets);
  
  
  // const eventsResults = await db
  //   .select({
  //     id: events.id,
  //     name: events.name,
  //     description: events.description,
  //     start: events.start,
  //     end: events.end,
  //     checkinStart: events.checkinStart,
  //     checkinEnd: events.checkinEnd,
  //     location: events.location,
  //     isUserCheckinable: events.isUserCheckinable,
  //     isHidden: events.isHidden,
  //     orgs: sql`array_agg(${eventsToCategories.categoryID})`.as("orgs"),
  //   })
  //   .from(events)
  //   .innerJoin(eventsToCategories, eq(events.id, eventsToCategories.eventID))
  //   .orderBy(desc(events.start))
  //   .groupBy(eventsToCategories.eventID, events.id, events.start);
  // .as("eventsWithOrgs");

  // const a = await db.select({
  //   id: eventsResults.id,
  //   name: eventsResults.name,
  //   description: eventsResults.description,
  //   start: eventsResults.start,
  //   end: eventsResults.end,
  //   checkinStart: eventsResults.checkinStart,
  //   checkinEnd: eventsResults.checkinEnd,
  //   location: eventsResults.location,
  //   isUserCheckinable: eventsResults.isUserCheckinable,
  //   isHidden: eventsResults.isHidden,
  //   orgs: eventsResults.orgs,
  // }).from(eventsResults)

  // const eventBuckets = new Map<string,EventType[]>();

  // for (const event of eventsResults){
  //   const todateString = event.start.toDateString();
  //   if (todateString in eventBuckets){
  //     if (eventBuckets.has(todateString)){
  //       eventBuckets.get(todateString)?.push(event);
  //     }
  //     else{
  //       eventBuckets.set(todateString,[event]);
  //     }
  //   }
  // }

  


  return { events: eventResults, categories:categories };
}

// Add cache invalidation for the fetching
export default async function Events({searchParams}: {searchParams: SearchParams}){
    
    // Note: when making our db call 
    // const dummyData: Array<EventType> = [
    //   {
    //     id: randomUUID(),
    //     name: "Chicken n Pickle Social w/Mitre with a biiiiggggg name for testing",
    //     description: "This is the first event",
    //     start: new Date("2022-01-01T12:00:00Z"),
    //     end: new Date("2022-01-01T01:00:00Z"),
    //     checkinStart: new Date("2022-01-01T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-01T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [
    //       { id: "id", name: "ACM-W", color: "#7BE9E8" },
    //       { id: "id", name: "Coding in Color", color: "#d07cff" },
    //     ],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Fall Open House",
    //     description: "This is the second event",
    //     start: new Date("2022-01-02T00:00:00Z"),
    //     end: new Date("2022-01-02T01:00:00Z"),
    //     checkinStart: new Date("2022-01-02T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-02T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [{ id: "id", name: "ACM", color: "#179BD5" }],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Chicken n Pickle Social w/Mitre",
    //     description: "This is the third event",
    //     start: new Date("2022-01-03T00:00:00Z"),
    //     end: new Date("2022-01-03T01:00:00Z"),
    //     checkinStart: new Date("2022-01-03T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-03T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [{ id: "id", name: "Rowdy Creators", color: "#FFD51E" }],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 4",
    //     description: "This is the fourth event",
    //     start: new Date("2022-01-04T15:00:00Z"),
    //     end: new Date("2022-01-04T01:00:00Z"),
    //     checkinStart: new Date("2022-01-04T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-04T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [
    //       { id: "id", name: "Coding in Color", color: "#d07cff" },
    //       { id: "id", name: "ACM", color: "#179BD5" },
    //     ],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "ICPC General Meeting",
    //     description: "This is the fifth event",
    //     start: new Date("2022-01-05T01:00:00Z"),
    //     end: new Date("2022-01-05T01:00:00Z"),
    //     checkinStart: new Date("2022-01-05T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-05T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [{ id: "id", name: "ICPC", color: "#4ab667" }],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 6",
    //     description: "This is the sixth event",
    //     start: new Date("2022-01-06T00:00:00Z"),
    //     end: new Date("2022-01-06T01:00:00Z"),
    //     checkinStart: new Date("2022-01-06T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-06T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [
    //       { id: "id", name: "Rowdy Creators", color: "#FFD51E" },
    //       { id: "id", name: "ACM", color: "#179BD5" },
    //     ],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 7",
    //     description: "This is the seventh event",
    //     start: new Date("2022-01-07T00:00:00Z"),
    //     end: new Date("2022-01-07T01:00:00Z"),
    //     checkinStart: new Date("2022-01-07T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-07T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [
    //       { id: "id", name: "ACM-W", color: "#7BE9E8" },
    //       { id: "id", name: "Coding in Color", color: "#d07cff" },
    //     ],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 8",
    //     description: "This is the eighth event",
    //     start: new Date("2022-01-08T08:00:00Z"),
    //     end: new Date("2022-01-08T01:00:00Z"),
    //     checkinStart: new Date("2022-01-08T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-08T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [
    //       { id: "id", name: "ICPC", color: "#4ab667" },
    //       { id: "id", name: "Rowdy Creators", color: "#FFD51E" },
    //     ],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 9",
    //     description: "This is the ninth event",
    //     start: new Date("2022-01-09T00:00:00Z"),
    //     end: new Date("2022-01-09T01:00:00Z"),
    //     checkinStart: new Date("2022-01-09T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-09T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [
    //       { id: "id", name: "ACM", color: "#179BD5" },
    //       { id: "id", name: "ACM-W", color: "#7BE9E8" },
    //     ],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 10",
    //     description: "This is the tenth event",
    //     start: new Date("2022-01-10T00:00:00Z"),
    //     end: new Date("2022-01-10T01:00:00Z"),
    //     checkinStart: new Date("2022-01-10T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-10T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [{ id: "id", name: "Coding in Color", color: "#d07cff" }],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 11",
    //     description: "This is the eleventh event",
    //     start: new Date("2022-01-11T00:00:00Z"),
    //     end: new Date("2022-01-11T01:00:00Z"),
    //     checkinStart: new Date("2022-01-11T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-11T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [{ id: "id", name: "ACM", color: "#179BD5" }],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 12",
    //     description: "This is the twelfth event",
    //     start: new Date("2022-01-12T00:00:00Z"),
    //     end: new Date("2022-01-12T01:00:00Z"),
    //     checkinStart: new Date("2022-01-12T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-12T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [{ id: "id", name: "Rowdy Creators", color: "#FFD51E" }],
    //   },
    //   {
    //     id: randomUUID(),
    //     name: "Event 13",
    //     description: "This is the thirteenth event",
    //     start: new Date("2022-01-13T00:00:00Z"),
    //     end: new Date("2022-01-13T01:00:00Z"),
    //     checkinStart: new Date("2022-01-13T00:00:00Z"),
    //     checkinEnd: new Date("2022-01-13T00:30:00Z"),
    //     location: "Dummy Location",
    //     isUserCheckinable: true,
    //     isHidden: false,
    //     orgs: [
    //       { id: "id", name: "Coding in Color", color: "#d07cff" },
    //       { id: "id", name: "ACM", color: "#179BD5"},],
    //   }
    // ];
    console.time('getEventData');
    const {events,categories} = await getEventData(searchParams);
    // console.log(events);
    // console.log(categories)
    console.timeEnd('getEventData');
    
    return (
      <div className="h-screen w-screen flex flex-col items-center no-scrollbar  ">
        {/* <Navbar /> */}
        <EventsTitle />
        <EventsView allEvents={events} categories={categories} />
      </div>
    );
}

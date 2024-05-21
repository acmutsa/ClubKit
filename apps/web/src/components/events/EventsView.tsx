'use client'
import { useEffect, useState,useRef } from "react"
import EventsOptionsBar from "./EventsOptionsBar"
import EventsCardView from "./EventsCardView";
import EventsCalendarView from "./EventsCalendarView";
import type { EventType } from "config";

export interface Filters {
  view: 'calendar' | 'card';
  showPastEvents: boolean;
  checkedOrgs: Set<string>;
  searchQuery: string;
}
export type HandleFilterValue = string | boolean | Set<string>;
// Original data fetching will be done by a server component and any further filtering will be handled client-side. Data is not super large or sensentive so this is fine
export default function EventsView({ allEvents }: { allEvents: Array<EventType> }) {
  const [events,setEvents] = useState<Array<EventType>>(allEvents);
  const loaded = useRef(false);
   const defaultFilters:Filters = {
    view:'card',
    showPastEvents:false,
    checkedOrgs:new Set<string>(),
    searchQuery:""
  } 
  const [filters,setFilters] = useState<Filters>(defaultFilters);
  useEffect(()=>{
    console.log("Filters have changed",filters);
    
    // This is basically just to save a bit of computation as we do not need to filter on the first render
    if (loaded.current){
      const filteredEvents = filterEvents();
      setEvents(filteredEvents);
    }
    else{
      loaded.current = true;
    }
  } ,[filters]);


  const filterEvents = ():Array<EventType>=>{
    console.log("called with filters",filters)
    
    const data = allEvents.filter((event) => {
        console.log("Checking event",event.name,filters.searchQuery);
       const containsSearch = event.name.toUpperCase().trim().includes(filters.searchQuery.toUpperCase().trim());
       const containsOrgs = filters.checkedOrgs.size > 0
          ? event.orgs.some((org) => filters.checkedOrgs.has(org.name))
          : true
      return (
        // Check if the search value is within the word
       containsSearch && containsOrgs
          
      );
    });

    console.log("Data size:",data.length);
    return data;
    

  }

  const handleFilterChange = (k:string ,value:string | boolean | Set<string>)=>{
    setFilters({...filters,[k]:value});
  }

  const eventOptionsProps = {
    filters,
    handleFilterChange
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex items-center justify-center">
        <EventsOptionsBar {...eventOptionsProps} />
      </div>
      {events.length > 0 ? (
        <>
          {filters.view === "card" ? (
            <EventsCardView events={events} />
          ) : (
            <EventsCalendarView events={events} />
          )}
        </>
      ) : (
        <div className="flex flex-col w-full justify-center pt-[6%] md:pt-[2%] space-y-6">
          <h1 className="w-full text-center text-3xl font-bold">
            Womp Womp :(
          </h1>
          <h1 className="w-[95%] mx-auto text-center text-xl">
            There are no events to display at this time for your desired
            parameters. Please check back later or widen your filtering options.
          </h1>
        </div>
      )}
    </div>
  );
}
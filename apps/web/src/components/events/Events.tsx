// Should have a sticky top bar that allows for filtering by most to least recent, by org, can render either a calendar or a card view, search feature (?) and render either card or calendar view of events
import type { EventType } from "config";
import { randomUUID } from "crypto";
import EventsCardView from "./EventsCardView";
import FadeInText from "./FadeInText";
export default function Events(){
    // Remove after testing
    const eventTypes = {
    ACM: {
      color: "#179BD5",
    },
    "ACM-W": {
      color: "#7BE9E8",
    },
    "Rowdy Creators": {
      color: "#FFD51E",
    },
    "Coding in Color": {
      color: "#d07cff",
    },
    "ICPC":{
      color: "#16a34a",
    }
}
    // Note: when making our db call 
    const dummyData: Array<EventType> = [
      {
        id: randomUUID(),
        name: "Chicken n Pickle Social w/Mitre",
        description: "This is the first event",
        start: new Date("2022-01-01T12:00:00Z"),
        end: new Date("2022-01-01T01:00:00Z"),
        checkinStart: new Date("2022-01-01T00:00:00Z"),
        checkinEnd: new Date("2022-01-01T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [
          { id: "id", name: "ACM-W", color: "#7BE9E8" },
          { id: "id", name: "Coding in Color", color: "#d07cff" },
        ],
      },
      {
        id: randomUUID(),
        name: "Chicken n Pickle Social w/Mitre",
        description: "This is the second event",
        start: new Date("2022-01-02T00:00:00Z"),
        end: new Date("2022-01-02T01:00:00Z"),
        checkinStart: new Date("2022-01-02T00:00:00Z"),
        checkinEnd: new Date("2022-01-02T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [{ id: "id", name: "ACM", color: "#179BD5" }],
      },
      {
        id: randomUUID(),
        name: "Chicken n Pickle Social w/Mitre",
        description: "This is the third event",
        start: new Date("2022-01-03T00:00:00Z"),
        end: new Date("2022-01-03T01:00:00Z"),
        checkinStart: new Date("2022-01-03T00:00:00Z"),
        checkinEnd: new Date("2022-01-03T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [{ id: "id", name: "Rowdy Creators", color: "#FFD51E" }],
      },
      {
        id: randomUUID(),
        name: "Event 4",
        description: "This is the fourth event",
        start: new Date("2022-01-04T15:00:00Z"),
        end: new Date("2022-01-04T01:00:00Z"),
        checkinStart: new Date("2022-01-04T00:00:00Z"),
        checkinEnd: new Date("2022-01-04T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [
          { id: "id", name: "Coding in Color", color: "#d07cff" },
          { id: "id", name: "ACM", color: "#179BD5" },
        ],
      },
      {
        id: randomUUID(),
        name: "Event 5",
        description: "This is the fifth event",
        start: new Date("2022-01-05T01:00:00Z"),
        end: new Date("2022-01-05T01:00:00Z"),
        checkinStart: new Date("2022-01-05T00:00:00Z"),
        checkinEnd: new Date("2022-01-05T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [{ id: "id", name: "ICPC", color: "#4ab667" }],
      },
      {
        id: randomUUID(),
        name: "Event 6",
        description: "This is the sixth event",
        start: new Date("2022-01-06T00:00:00Z"),
        end: new Date("2022-01-06T01:00:00Z"),
        checkinStart: new Date("2022-01-06T00:00:00Z"),
        checkinEnd: new Date("2022-01-06T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [
          { id: "id", name: "Rowdy Creators", color: "#FFD51E" },
          { id: "id", name: "ACM", color: "#179BD5" },
        ],
      },
      {
        id: randomUUID(),
        name: "Event 7",
        description: "This is the seventh event",
        start: new Date("2022-01-07T00:00:00Z"),
        end: new Date("2022-01-07T01:00:00Z"),
        checkinStart: new Date("2022-01-07T00:00:00Z"),
        checkinEnd: new Date("2022-01-07T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [
          { id: "id", name: "ACM-W", color: "#7BE9E8" },
          { id: "id", name: "Coding in Color", color: "#d07cff" },
        ],
      },
      {
        id: randomUUID(),
        name: "Event 8",
        description: "This is the eighth event",
        start: new Date("2022-01-08T08:00:00Z"),
        end: new Date("2022-01-08T01:00:00Z"),
        checkinStart: new Date("2022-01-08T00:00:00Z"),
        checkinEnd: new Date("2022-01-08T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [
          { id: "id", name: "ICPC", color: "#4ab667" },
          { id: "id", name: "Rowdy Creators", color: "#FFD51E" },
        ],
      },
      {
        id: randomUUID(),
        name: "Event 9",
        description: "This is the ninth event",
        start: new Date("2022-01-09T00:00:00Z"),
        end: new Date("2022-01-09T01:00:00Z"),
        checkinStart: new Date("2022-01-09T00:00:00Z"),
        checkinEnd: new Date("2022-01-09T00:30:00Z"),
        location: "Dummy Location",
        isUserCheckinable: true,
        isHidden: false,
        orgs: [
          { id: "id", name: "ACM", color: "#179BD5" },
          { id: "id", name: "ACM-W", color: "#7BE9E8" },
        ],
      },
    ];
    return (
      <div className="w-full h-full flex flex-col items-center">
       <FadeInText />
        <EventsCardView Events={dummyData} />
      </div>
    );
}
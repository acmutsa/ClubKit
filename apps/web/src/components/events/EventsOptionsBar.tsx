'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import React from "react";
import { Calendar,Grid2X2,Search,ChevronDown } from "lucide-react";
import clsx from "clsx";
import c from "config";
import type { Filters,HandleFilterValue } from "./EventsView";
import CategoryCheckBox from "./CategoryCheckBox";
interface EventsOptionsBarProps {
    filters:Filters;
    handleFilterChange:(k:string,value:HandleFilterValue)=>void;
}

export default function EventsOptionsBar(props: EventsOptionsBarProps) {
// Switch to show past events or not, selector for orgs, search for events
const orgs = Object.keys(c.eventTypes);

const filters = props.filters;
const handleFilterChange = props.handleFilterChange;
const cardViewSelected = filters.view === "card";
const showPastEvents = filters.showPastEvents;

return (
  <div className="flex flex-row justify-between w-[95%] rounded-lg bg-slate-300  opacity-80">
    {/* Selector for soonest and latest date */}
    {cardViewSelected && (
      <Select
        onValueChange={(value) =>
          handleFilterChange("showPastEvents", value === "past")
        }>
        <SelectTrigger className="h-auto w-1/3 sm:w-[120px] md:w-[180px] bg-transparent border-transparent pl-3 sm:pl-2 md:pl-3 py-0 md:py-2 opacity-100 justify-normal space-x-1 ">
          <SelectValue
            placeholder={showPastEvents ? "Past" : "Upcoming"}
            className="[color:black]"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="present">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )}
    {/* Mobile Search bar */}
    {cardViewSelected && (
      <>
        <div className="flex sm:hidden items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Search />
            </PopoverTrigger>
            <PopoverContent>
              <Input
                type="text"
                placeholder="Search for events"
                defaultValue={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange("searchQuery", e.target.value)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Desktop Search bar */}
        <div className="hidden sm:flex items-center w-1/3 justify-start  ">
          <Input
            type="text"
            placeholder="Search for events"
            defaultValue={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="py-0 my-0"
          />
        </div>
      </>
    )}
    <div className={clsx('flex justify-end',{
        'w-full justify-between':!cardViewSelected
    })}>
      {/* border border-input */}
      <div className="flex items-center justify-center hover:cursor-pointer  bg-transparent rounded-md px-2 mr-2">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center space-x-1">
              <p>Organizations</p>
              <ChevronDown size={15} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-full space-y-1">
            {/* Checkboxes for orgs */}
            {orgs.map((org) => (
              <CategoryCheckBox
                key={org}
                name={org}
                handleFilterChange={handleFilterChange}
                filters={filters}
              />
            ))}
          </PopoverContent>
        </Popover>
      </div>
      {/* Toggle for card or calendar view */}
      <div className="flex">
        <button
          onClick={() => handleFilterChange("view", "card")}
          className={clsx("p-2", {
            "border rounded-md bg-purple-500 border-black": cardViewSelected,
          })}>
          <Grid2X2 />
        </button>
        <button
          onClick={() => handleFilterChange("view", "calendar")}
          className={clsx("p-2", {
            "border rounded-md bg-purple-500 border-black": !cardViewSelected,
          })}>
          <Calendar />
        </button>
      </div>
    </div>
  </div>
);



}
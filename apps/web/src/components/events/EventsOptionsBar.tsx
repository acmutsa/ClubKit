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
    categories:Array<{id:string,name:string,color:string}>;
    handleFilterChange:(k:string,value:HandleFilterValue)=>void;
}

export default function EventsOptionsBar(props: EventsOptionsBarProps) {
// Switch to show past events or not, selector for orgs, search for events
const categories = props.categories;

const filters = props.filters;
const handleFilterChange = props.handleFilterChange;
const cardViewSelected = filters.view === "card";
const showPastEvents = filters.showPastEvents;

return (
  <div className="flex flex-row justify-between w-[90%] rounded-lg border-2   ">
    {/* Selector for soonest and latest date */}
    {cardViewSelected && (
      <Select
        onValueChange={(value) =>
          handleFilterChange("showPastEvents", value === "past")
        }>
        <SelectTrigger className="h-auto sm:w-[100px] md:w-[180px] bg-transparent border-transparent pl-2 pr-0 sm:pl-2 md:pl-3 py-0 md:py-2 opacity-100 justify-normal space-x-1 focus:ring-offset-0 focus:ring-0 text-sm">
          <SelectValue
            placeholder={showPastEvents ? "Past" : "Upcoming"}
            className="[color:black] truncate text-ellipsis w-[50px]"
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
        <div className="flex sm:hidden items-center justify-center mr-1">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center">
                <Search />
                <ChevronDown size={15} />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Input
                type="text"
                placeholder="Search for events"
                defaultValue={filters.searchQuery}
                className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0"
                onChange={(e) =>
                  handleFilterChange("searchQuery", e.target.value)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Desktop Search bar */}
        {/* border-b-2 border-black */}
        <div className="hidden sm:flex items-center w-1/3 justify-start ring-black rounded-md focus-within:ring-1  ">
          <Search className="" />

          <Input
            type="text"
            placeholder="Search for events"
            defaultValue={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="py-0 my-0 bg-transparent border-transparent focus-visible:ring-offset-0 focus-visible:ring-0  "
          />
        </div>
      </>
    )}
    <div
      className={clsx("flex justify-end", {
        "w-full justify-between": !cardViewSelected,
      })}>
      {/* border border-input */}
      <div className="flex items-center justify-center hover:cursor-pointer  bg-transparent rounded-md px-2 mr-2">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center space-x-1">
              <p className="text-sm">Categories</p>
              <ChevronDown size={15} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-full space-y-1">
            {/* Checkboxes for orgs */}
            {categories.map((category) => (
              <CategoryCheckBox
                key={category.id}
                category={category}
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
            "border rounded-md bg-stone-300 bg-opacity-80 ": cardViewSelected,
          })}>
          <Grid2X2 />
        </button>
        <button
          onClick={() => handleFilterChange("view", "calendar")}
          className={clsx("p-2", {
            "border rounded-md bg-stone-300 bg-opacity-80 ": !cardViewSelected,
          })}>
          <Calendar />
        </button>
      </div>
    </div>
  </div>
);



}
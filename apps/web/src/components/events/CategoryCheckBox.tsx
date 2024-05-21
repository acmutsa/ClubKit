"use client"

import type { HandleFilterValue,Filters } from "./EventsView";
import { Checkbox } from "../ui/checkbox";
interface EventsOptionsBarProps {
    name:string;
    handleFilterChange: (k: string, value: HandleFilterValue) => void;
    filters: Filters;
}
import c from "config"

export default function CategoryCheckBox(props: EventsOptionsBarProps){
    const name = props.name as keyof typeof c.eventTypes; 
    const color = c.eventTypes[name].color;
    const filters = props.filters;
    const handleCheck = (name:string)=>{
        const newCheckedOrgs = props.filters.checkedOrgs;
        if (newCheckedOrgs.has(name)){
            newCheckedOrgs.delete(name);
        }
        else{
            newCheckedOrgs.add(name);
        }
        props.handleFilterChange("checkedOrgs",newCheckedOrgs);
    }
    return (
      <div className="flex items-center space-x-2">
        <Checkbox id={props.name} onClick={()=>{handleCheck(props.name)}}
        checked={filters.checkedOrgs.has(props.name)}
         />
        <label
          htmlFor={props.name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        //   This is code debt. Don't do this!!
           style={{color:color}}>
         {props.name}
        </label>
      </div>
    );


}

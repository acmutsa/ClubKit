"use client"

import type { HandleFilterValue,Filters } from "./EventsView";
import { Checkbox } from "../ui/checkbox";
interface EventsOptionsBarProps {
    category:{id:string,name:string,color:string}
    handleFilterChange: (k: string, value: HandleFilterValue) => void;
    filters: Filters;
}


export default function CategoryCheckBox(props: EventsOptionsBarProps){
    const category = props.category;
    const name = category.name
    const color = category.color
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
        <Checkbox id={name} onClick={()=>{handleCheck(name)}}
        checked={filters.checkedOrgs.has(name)}
         />
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          //  style={{color:color}}
           >
         {name}
        </label>
      </div>
    );


}

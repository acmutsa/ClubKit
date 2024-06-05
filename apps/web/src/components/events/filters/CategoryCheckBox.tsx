"use client"
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname,useSearchParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { EventCategory } from "./EventsOptionsBar";
import { eventFilters } from "./EventsOptionsBar";

export default function CategoryCheckBox({category,checkBoxSet}:{category:EventCategory,checkBoxSet:Set<string>}){
    const name = category.name;
    const color = category.color;
    
    const searchParams = useSearchParams();
    const {replace,refresh} = useRouter();
    const pathname = usePathname();
    const params = new URLSearchParams(searchParams);
	const checkedBoxes = params.get(eventFilters.categories);

    // This is being used as a fast way to update the state of the checkbox
    const [checked,setCheck] = useState(checkBoxSet.has(name));
    
    // Come back and test this logic
    const handleCheck = (name:string)=>{
        
        if(checkedBoxes){
            if(checkBoxSet.has(name)){
                checkBoxSet.delete(name);
                if (checkBoxSet.size<=0){
                    params.delete('categories');
                    replace(`${pathname}?${params.toString()}`);
                    return;
                }
            }else{
                checkBoxSet.add(name);
            }
            params.set('categories',Array.from(checkBoxSet).join(','));
        }else{
            params.set('categories',name);
        }
        console.log("Replacing with:",`${pathname}?${params.toString()}`);
        replace(`${pathname}?${params.toString()}`);
        // Next JS seems to be doing some weird stuff with how replace works where if it sees a similar thing we have done before, it will not refresh
        refresh();
    }
    return (
      <div className="flex items-center space-x-2">
        <Checkbox 
        id={name} 
        onClick={()=>{
            setCheck(!checked);
            handleCheck(name);  
        }}
        // Checked is based off of the search params sent in, but will call a small re-render of this piece 
        checked={checked}
        className=" focus-visible:ring-0 focus-visible:ring-offset-0"
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

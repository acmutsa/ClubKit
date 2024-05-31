
import CategoryCheckBox from "./CategoryCheckBox";
import { Popover,PopoverTrigger,PopoverContent } from "../../ui/popover";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { SearchParams } from "config";
import type { EventCategory } from "./EventsOptionsBar";

export default function CategoriesDropDown({cardViewSelected,categories,searchParams}:{cardViewSelected:boolean,categories:Array<EventCategory>,searchParams:SearchParams}){
    
    const checkBoxSet = new Set(searchParams.categories ? searchParams.categories.split(",") : []);

    return (
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
                checkBoxSet={checkBoxSet}
              />
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
    );
}



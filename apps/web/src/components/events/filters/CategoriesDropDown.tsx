
import CategoryCheckBox from "./CategoryCheckBox";
import { Popover,PopoverTrigger,PopoverContent } from "../../ui/popover";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { SearchParams } from "config";
import type { EventCategory } from "./EventsOptionsBar";

export default function CategoriesDropDown({cardViewSelected,categories,searchParams}:{cardViewSelected:boolean,categories:Array<EventCategory>,searchParams:SearchParams}){
    
    const checkBoxSet = new Set(searchParams.categories ? searchParams.categories.split(",") : []);
	console.log(checkBoxSet);
    return (
		<div
			className={clsx("flex justify-end", {
				"w-full justify-between": !cardViewSelected,
			})}
		>
			{/* border border-input */}
			<div className="mr-2 flex items-center justify-center  rounded-md bg-transparent px-2 hover:cursor-pointer">
				<Popover>
					<PopoverTrigger asChild>
						<div className="flex items-center ">
							<p className="w-12 truncate whitespace-nowrap  text-sm min-[350px]:w-16 min-[400px]:w-20 sm:w-auto">
								Categories
							</p>
							<ChevronDown size={15} />
						</div>
					</PopoverTrigger>
					<PopoverContent className="flex w-full flex-col space-y-1">
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



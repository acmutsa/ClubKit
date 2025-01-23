"use client";
import { EVENT_FILTERS } from "@/lib/constants/events";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "../../ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function EventsSearch({
	cardViewSelected,
}: {
	cardViewSelected: boolean;
}) {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();
	const { QUERY } = EVENT_FILTERS;

	// We use a debouncing strategy to prevent the search from querying every single keystroke and instead will run a time after the user completes typing
	const handleSearch = useDebouncedCallback((term) => {
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 100);

	return (
		<>
			{/* Mobile Search bar */}
			{cardViewSelected && (
				<>
					<div className="mr-1 flex items-center justify-center sm:hidden">
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
									defaultValue={searchParams
										.get(QUERY)
										?.toString()}
									className="bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
									onChange={(e) =>
										handleSearch(e.target.value)
									}
								/>
							</PopoverContent>
						</Popover>
					</div>
					{/* Desktop Search bar */}
					<div className="hidden items-center justify-end sm:flex md:w-3/4  ">
						<Search className="" />
						<Input
							type="text"
							placeholder="Search for events"
							defaultValue={searchParams.get(QUERY)?.toString()}
							onChange={(e) => handleSearch(e.target.value)}
							className="md:[40%] my-0 border-transparent bg-transparent py-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-1/2 "
						/>
					</div>
				</>
			)}
		</>
	);
}

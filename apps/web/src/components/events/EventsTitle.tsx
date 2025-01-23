import c from "config";
export default function EventsTitle() {
	return (
		<div className="flex w-full flex-col items-center justify-center space-y-1">
			<h1 className="pt-2 text-center text-5xl font-black md:text-6xl ">
				Events
			</h1>
			<h3 className="text-center font-bold sm:text-xl 2xl:text-2xl">
				Check Out What {c.clubName} Has Planned!
			</h3>
		</div>
	);
}

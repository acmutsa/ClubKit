import c from "config"
export default function EventsTitle(){
    
    return (
		<div className="flex flex-col w-full items-center justify-center fade-in-30 space-y-1 ">
			<h1 className="pt-2 text-5xl md:text-6xl font-black text-center">Events</h1>
            <h3 className="font-bold sm:text-xl text-center">Check out what {c.clubName} Has Planned!</h3>
		</div>
	);
}
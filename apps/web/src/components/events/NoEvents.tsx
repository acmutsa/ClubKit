export default function NoEvents() {
    return (
		<div className="flex w-full flex-1 flex-col items-center pt-[6%] md:pt-[2%]">
			<h1 className="w-full text-center text-3xl font-bold">Aw Man :(</h1>
			<h3 className="mx-auto w-[95%] text-center text-xl">
				There are no events to display at this time for your desired
				parameters.
			</h3>
			<h3 className="mx-auto w-[95%] text-center text-xl">
				Please check back later or widen your filtering options.
			</h3>
		</div>
	);
}
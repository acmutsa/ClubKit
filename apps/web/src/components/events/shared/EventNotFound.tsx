import c from "config"

export default function EventNotFound() {
    return (
		<div className="flex w-full flex-1 flex-col items-center space-y-5 md:justify-center">
			<h1 className="text-center text-6xl font-black">Event Not Found</h1>
			<p className="text-center">
				{"If you think this is a mistake, please email: "}
				<span>
					<a
						className="text-center underline"
						href={`mailto:${c.contactEmail}`}
					>
						{`${c.contactEmail}`}
					</a>
				</span>
			</p>
		</div>
  );

}

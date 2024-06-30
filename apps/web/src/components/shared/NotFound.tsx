import c from "config"
import Link from "next/link";
import { MoveLeft } from "lucide-react";
export default function NotFound({message,href}:{message:string,href:string}) {
    return (
		<div className="flex w-full flex-1 flex-col items-center justify-center space-y-5">
			<h1 className="text-center text-4xl font-black md:text-6xl">
				{message}
			</h1>
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
			<Link
				href={href}
				className="flex flex-row items-center justify-center space-x-2">
					<MoveLeft size={24} />
				<p>Go Back</p>
			</Link>
		</div>
	);

}

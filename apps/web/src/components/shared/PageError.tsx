import c from "config"
import Link from "next/link";
import { MoveLeft } from "lucide-react";
<<<<<<< HEAD
export default function PageError({message,href}:{message:string,href:string}) {
    return (
		<div className="flex w-full flex-1 flex-col items-center justify-center space-y-5">
			<h1 className="text-center text-4xl font-black md:text-6xl">
=======
export default function PageError({message,href,className}:{message:string,href:string,className?:string}) {
    return (
		<div className={`flex w-full flex-1 flex-col items-center justify-center space-y-5 ${className}`}>
			<h1 className="text-center text-3xl sm:text-4xl font-black md:text-5xl lg:text-6xl">
>>>>>>> dev
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
<<<<<<< HEAD
				className="flex flex-row items-center justify-center space-x-2">
					<MoveLeft size={24} />
=======
				className="flex flex-row items-center justify-center space-x-2 border-b border-muted-foreground ">
				<MoveLeft size={24} />
>>>>>>> dev
				<p>Go Back</p>
			</Link>
		</div>
	);

}

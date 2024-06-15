import Navbar from "@/components/shared/navbar";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
export default function Home() {
	return (
		<>
			<header>
				<Navbar showBorder />
			</header>
			<main className="flex h-screen w-screen items-center justify-center">
				<h1 className="text-4xl font-black">ClubKit</h1>
			</main>
		</>
	);
}

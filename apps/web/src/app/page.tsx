import Navbar from "@/components/shared/navbar";
export default function Home() {
	return (
		<div className="h-screen w-screen flex flex-col">
			<header>
				<Navbar showBorder />
			</header>
			<main className="flex flex-1 w-full items-center justify-center">
				<h1 className="text-4xl font-black">ClubKit</h1>
			</main>
		</div>
	);
}

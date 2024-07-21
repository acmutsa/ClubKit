import Navbar from "@/components/shared/navbar";
export default function Home() {
	return (
		// bg-[var(--my-var,var(--my-background,pink))]
		<div className=" h-[100dvh] flex w-screen flex-col">
			<header>
				<Navbar showBorder />
			</header>
			<main className="flex w-full flex-1 items-center justify-center">
				<h1 className="text-4xl font-black">ClubKit</h1>
			</main>
		</div>
	);
}

import Navbar from "@/components/shared/navbar";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Github } from "lucide-react";
import Footer from "./footer";
export default function Home() {
	return (
		// bg-[var(--my-var,var(--my-background,pink))]
		<div className=" flex h-[100dvh] w-screen flex-col">
			<header>
				<Navbar showBorder />
			</header>
			<main className="flex w-full flex-1 flex-col items-center justify-center space-y-5">
				<h1 className="text-4xl font-black">ClubKit</h1>
				<Link href="/events" className="h-min p-2 underline">
					<p>Find Events →</p>
				</Link>
			</main>
			<Footer />
		</div>

	);
}

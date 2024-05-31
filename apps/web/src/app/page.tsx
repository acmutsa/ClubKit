import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
export default function Home() {
	return (
    <main className="h-screen w-screen flex flex-col items-center ">
      {/* <Navbar /> */}
      <div className="w-full flex h-full items-center justify-center">
        <h1 className="font-black text-4xl">ClubKit</h1>
      </div>
    </main>
  );
}

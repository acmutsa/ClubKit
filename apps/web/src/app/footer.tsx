"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Github } from "lucide-react";


export default function Footer() {
    const currentYear = new Date().getFullYear();
	return (
        <footer className="relative bottom-0 w-full h-[5] bg-slate-500">
        <p className="text-white-500 self-center justify-self-center text-center font-mono text-xs sm:col-start-2 md:py-0 lg:col-span-3 lg:col-start-2 lg:row-start-2 lg:w-11/12">
            Made with &lt;/&gt; &amp; ♥ @ACM Projects
            <br />©Association of Computing
            Machinery at UTSA {currentYear}. All Rights Reserved.
        </p>


    </footer>
    );
}
"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

interface SettingsNavProps extends HTMLAttributes<HTMLElement> {
	className?: string;
	items: {
		href: string;
		title: string;
	}[];
}

export function SettingsNav({ items, className, ...props }: SettingsNavProps) {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				className,
				"flex max-h-screen flex-wrap justify-between space-x-1 md:justify-around lg:flex-col lg:justify-start lg:space-x-0 lg:space-y-1",
			)}
			{...props}
		>
			{items.map(({ href, title }) => (
				<Link
					prefetch={true}
					key={title}
					href={href}
					className={cn(
						buttonVariants({ variant: "ghost" }),
						pathname === href && "bg-muted"
							? "bg-muted"
							: "hover:bg-transparent hover:underline",
						"lg:justify-start text-sm font-semibold lg:text-lg flex-1",
					)}
				>
					{title}
				</Link>
			))}
		</nav>
	);
}

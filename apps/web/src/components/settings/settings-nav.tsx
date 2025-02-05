import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface SettingsNavProps extends HTMLAttributes<HTMLElement> {
	className?: string;
	items: {
		href: string;
		title: string;
	}[];
}

export function SettingsNav({ items, className, ...props }: SettingsNavProps) {
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
						"flex-1 text-sm font-semibold lg:justify-start lg:text-lg",
					)}
				>
					{title}
				</Link>
			))}
		</nav>
	);
}

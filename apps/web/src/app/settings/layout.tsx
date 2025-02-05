import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/navbar";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsDropdown } from "@/components/settings/settings-dropdown";

interface UserSettingsLayoutProps extends PropsWithChildren {}

const links: { href: string; title: string }[] = [
	{ href: "/settings#account", title: "Account" },
	{ href: "/settings#profile", title: "Profile" },
	{ href: "/settings#club", title: "Club" },
	{ href: "/settings#school", title: "School" },
];

export default async function UserSettingsLayout({
	children,
}: UserSettingsLayoutProps) {
	return (
		<>
			<Navbar showBorder siteRegion="Settings" />
			<main className="w-full grid-cols-10 justify-center lg:grid lg:gap-12 lg:space-y-0 lg:px-6 lg:pt-6">
				<aside className="col-span-2 hidden lg:block">
					<SettingsNav items={links} className="sticky top-8" />
				</aside>

				<SettingsDropdown
					items={links}
					className="sticky top-0 z-50 mb-4 bg-background lg:hidden"
				/>

				<section className="overflow-y-auto px-1 pb-8 sm:px-3 lg:col-span-8">
					{children}
				</section>
			</main>
			<Toaster richColors />
		</>
	);
}

import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/navbar";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsDropdown } from "@/components/settings/settings-dropdown";

interface UserSettingsLayoutProps extends PropsWithChildren { }

const links: { href: string; title: string }[] = [
	{ href: "/settings", title: "Account" },
	{ href: "/settings/profile", title: "Profile" },
	{ href: "/settings/club", title: "Club" },
	{ href: "/settings/school", title: "School" },
];

export default async function UserSettingsLayout({
	children,
}: UserSettingsLayoutProps) {
	return (
		<>
			<Navbar showBorder siteRegion="Settings" />
			<main className="lg:grid grid-cols-10 w-screen justify-center lg:gap-12 lg:space-y-0 lg:px-6 lg:pt-6">
				<aside className="hidden lg:block col-span-2">
					<SettingsNav
						items={links}
						className="top-8 sticky"
					/>
				</aside>

				<SettingsDropdown items={links} className="mb-4 lg:hidden" />

				<section className="lg:col-span-6 pb-8 overflow-y-auto px-3">
					{children}
				</section>
			</main>
			<Toaster richColors />
		</>
	);
}

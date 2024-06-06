import Navbar from "@/components/shared/navbar";

export default function DashLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar siteRegion="Dashboard" />
			<div>{children}</div>
		</>
	);
}

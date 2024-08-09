import MonthlyRegistrationChart from "@/components/dash/admin/overview/MonthlyRegistrationChart";
import { getRegistrationsByMonth } from "@/lib/queries/charts";
import { Suspense } from "react";

export default async function Page() {
	const monthlyRegistrations = await getRegistrationsByMonth();
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Overview
				</h1>
			</div>
			<div className="grid grid-flow-col grid-cols-12">
				<div className="col-span-4">
					<Suspense
						fallback={
							<div className="text-foreground">
								Retrieving registration chart. One sec...
							</div>
						}
					>
						<MonthlyRegistrationChart
							registrations={monthlyRegistrations}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
}

import { Suspense } from "react";
import AdminSemesterView from "@/components/dash/admin/semesters/SemesterView";
export default function Page() {
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Semesters
				</h1>
			</div>
			<Suspense fallback={<div>Grabbing checkin stats. One sec...</div>}>
				<AdminSemesterView />
			</Suspense>
		</div>
	);
}

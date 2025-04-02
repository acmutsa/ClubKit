import { DataTable } from "@/components/ui/data-table";
import { getAllSemesters } from "@/lib/queries/semesters";
import { semesterColumns } from "@/app/admin/semesters/columns";
import CreateSemesterDialogue from "./CreateSemesterDialogue";

export const dynamic = "force-dynamic";

export default async function AdminSemesterView() {
	const semesters = await getAllSemesters();

	return (
		<>
			<div className="mx-5 flex items-center justify-between rounded-lg border p-2">
				<div className="flex w-fit space-x-4">
					<div className="flex flex-col p-1">
						<span className="text-xs text-muted-foreground">
							Total Semesters
						</span>
						<span className="text-lg font-semibold">
							{semesters.length}
						</span>
					</div>
				</div>
				<CreateSemesterDialogue />
			</div>
			<div className="rounded-xl p-5">
				<DataTable
					data={semesters}
					columns={semesterColumns}
					options={{
						tableName: "semesters",
					}}
				/>
			</div>
		</>
	);
}

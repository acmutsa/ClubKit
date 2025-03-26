import { getAllCategories } from "@/lib/queries/categories";
import { DataTable } from "@/components/ui/data-table";
import CreateCategory from "./CreateCategoryDialogue";
import { eventCategoryColumns } from "@/app/admin/categories/columns";

export default async function AdminCategoryView() {
	const categories = await getAllCategories();

	return (
		<>
			<div className="mx-5 flex items-center justify-between rounded-lg border p-2">
				<div className="flex w-fit space-x-4">
					<div className="flex flex-col p-1">
						<span className="text-xs text-muted-foreground">
							Total Categories
						</span>
						<span className="text-lg font-semibold">
							{categories.length}
						</span>
					</div>
				</div>
				<CreateCategory />
			</div>
			<div className="rounded-xl p-5">
				<DataTable
					data={categories}
					columns={eventCategoryColumns}
					options={{
						tableName: "categories",
					}}
				/>
			</div>
		</>
	);
}

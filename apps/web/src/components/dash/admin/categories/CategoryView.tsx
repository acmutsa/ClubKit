import { getAllCategories } from "@/lib/queries/categories";
import { DataTable } from "@/components/ui/data-table";
import CreateCategory from "./CreateCategoryDialogue";
import { eventCategoryColumns } from "@/app/admin/categories/columns";
import StatItem from "../../shared/StatItem";

export default async function AdminCategoryView() {
	const categories = await getAllCategories();

	return (
		<>
			<div className="mx-5 flex items-center justify-between rounded-lg">
				<div className="flex w-fit space-x-4">
					<StatItem
						label="Total Categories"
						value={categories.length}
					/>
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

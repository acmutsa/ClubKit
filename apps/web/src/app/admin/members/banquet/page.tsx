import getBanquetQualifiers from "@/lib/queries/users";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
export default async function BanquetQualifiersPage() {
	const data = await getBanquetQualifiers();
	console.log(data);
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Banquet Qualifiers
				</h1>
			</div>
			<div className="rounded-xl p-5">
				<DataTable
					columns={columns}
					data={data}
					options={{
						tableName:"banquet qualifiers",
					}}
				/>
			</div>
		</div>
	);
}

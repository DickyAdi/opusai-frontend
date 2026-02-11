import { ComponentDataTable } from "@/components/ui/data-table";
import { useSmartSearchSchemas } from "@/hooks/useSmartsearch";
import { columns } from "./columns";

export default function DashboardSmartsearchViewTable() {
	const data = useSmartSearchSchemas();
	const cols = columns;

	return (
		<div className="h-full">
			<ComponentDataTable data={data} columns={cols} size="md" />
		</div>
	);
}

import type { FetchSmartSearchSchemaResponse } from "@/lib/type/smartsearch";
import { memo, useMemo } from "react";

const FilterSection = memo(function FilterSection({
	groups,
	selectedGroup,
}: {
	groups: FetchSmartSearchSchemaResponse;
	selectedGroup: string;
}) {
	const selectedFieldSchemas = useMemo(() => {
		return groups.schemas.find((e) => e.id === selectedGroup)?.field_schemas;
	}, [groups, selectedGroup]);
	return (
		<div className="flex flex-col gap-2 p-4">
			{selectedFieldSchemas ? (
				selectedFieldSchemas.map((e) => (
					<div key={e.id} className="border p-2 rounded-lg">
						<div className="flex flex-row items-center justify-between">
							<h4 className="text-base capitalize">{e.name}</h4>
							<h4 className="text-xs capitalize">({e.type})</h4>
						</div>
					</div>
				))
			) : (
				<h4 className="text-base font-semibold">No filters available</h4>
			)}
		</div>
	);
});

export { FilterSection };

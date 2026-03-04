import { knowledgeType } from "@/lib/type/knowledge";
import { ColumnDef } from "@tanstack/react-table";
import { ComponentDataTable, DataTableColumnHeader } from "../ui/data-table";
import { formattedDateToDDMMYYYY } from "@/lib/utils";
import { Button } from "../ui/button";
import { EraserIcon } from "lucide-react";
import {
	useFetchNextKnowledges,
	useFetchPreviousKnowledges,
	useKnowledgeHasNext,
	useKnowledgeHasPrevious,
	useKnowledgeLoading,
	useKnowledgeLoadingNext,
	useKnowledgeLoadingPrevious,
	useKnowledgePageSize,
	useKnowledgePagination,
	useKnowledges,
	useSetKnowledgePageSize,
} from "@/hooks/useRag";
import { useEffect } from "react";

export const KnowledgeManagementColumns: ColumnDef<knowledgeType>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
	},
	{
		accessorKey: "stored_name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Filename" />
		),
	},
	{
		accessorKey: "last_modified",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Modified" />
		),
		cell: ({ row }) => {
			return formattedDateToDDMMYYYY(row.original.last_modified);
		},
	},
	{
		header: "Actions",
		id: "actions",
		cell: ({ row }) => {
			const data = row.original;

			return (
				<div className="flex gap-2">
					<Button
						className="cursor-pointer"
						variant={"destructive"}
						size={"icon-sm"}
						onClick={() => {
							console.log(`Delete button clicked for ${data.stored_name}`);
						}}
					>
						<EraserIcon className="h-4 w-4" />
					</Button>
				</div>
			);
		},
	},
];

export function KnowledgeManagementTable() {
	const knowledges = useKnowledges();
	const fetchNext = useFetchNextKnowledges();
	const fetchPrevious = useFetchPreviousKnowledges();
	const setPageSize = useSetKnowledgePageSize();
	const pageSize = useKnowledgePageSize();
	const isLoading = useKnowledgeLoading();
	const hasNext = useKnowledgeHasNext();
	const hasPrevious = useKnowledgeHasPrevious();
	const isLoadingNext = useKnowledgeLoadingNext();
	const isLoadingPrevious = useKnowledgeLoadingPrevious();
	useEffect(() => {
		console.log(`Printing knowledges ${knowledges.length}`);
		console.log(`Printing hasNext ${hasNext}`);
		console.log(`Printing hasPrevious ${hasPrevious}`);
		console.log(`Printing pageSize ${pageSize}`);
	}, [knowledges, hasNext, hasPrevious, pageSize]);
	return (
		<ComponentDataTable
			size={"sm"}
			data={knowledges}
			columns={KnowledgeManagementColumns}
			enablePagination={true}
			cursorBasedPagination={true}
			cursorConfig={{
				hasNext: hasNext,
				hasPrevious: hasPrevious,
				onNext: () => {
					console.log("fetch next running");
					fetchNext();
				},
				onPrevious: () => {
					console.log("fetch prev running");
					fetchPrevious();
				},
				onPageSizeChange: (pageSize: number) => {
					console.log("fetch page size change running");
					setPageSize(pageSize);
				},
				isLoading: isLoading || isLoadingNext || isLoadingPrevious,
			}}
		/>
	);
}

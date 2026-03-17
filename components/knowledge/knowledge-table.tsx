import { knowledgeType } from "@/lib/type/knowledge";
import { ColumnDef } from "@tanstack/react-table";
import { ComponentDataTable, DataTableColumnHeader } from "../ui/data-table";
import { formattedDateToDDMMYYYY } from "@/lib/utils";
import { Button } from "../ui/button";
import { EraserIcon, Eye } from "lucide-react";
import {
	useClearKnowledgeError,
	useDeleteKnowledges,
	useFetchNextKnowledges,
	useFetchPreviousKnowledges,
	useKnowledgeCurrentPage,
	useKnowledgeError,
	useKnowledgeHasNext,
	useKnowledgeHasPrevious,
	useKnowledgeIsSearching,
	useKnowledgeLoading,
	useKnowledgeLoadingNext,
	useKnowledgeLoadingPrevious,
	useKnowledgePaginationMode,
	useKnowledges,
	useKnowledgeTotalPages,
	useRemoveKnowledges,
	useSearchKnowledges,
	useSetKnowledgePageSize,
} from "@/hooks/useRag";
import { useCallback, useEffect, useState } from "react";
import { useAppendError } from "@/hooks/useError";
import { useAppendSuccess } from "@/hooks/useSuccess";
import { Spinner } from "../ui/spinner";
import { FileReferenceModal } from "../chat/files/file_reference";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";

export const KnowledgeManagementColumns: ColumnDef<knowledgeType>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Filename" />
		),
		cell: ({ row }) => {
			const value = row.getValue("name") as string;
			return (
				<div className="max-w-md line-clamp-2" title={value}>
					{value}
				</div>
			);
		},
	},
	{
		accessorKey: "stored_name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="File ID" />
		),
		cell: ({ row }) => {
			const value = row.getValue("stored_name") as string;
			return (
				<div className="max-w-md line-clamp-2" title={value}>
					{value}
				</div>
			);
		},
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
					<KnowledgeTableDeleteButton file={data.stored_name} />
					<KnowledgeTableViewButton filename={data.stored_name} />
				</div>
			);
		},
	},
];

function KnowledgeTableDeleteButton({ file }: { file: string }) {
	const deleteKnowledges = useDeleteKnowledges();
	const appendError = useAppendError();
	const appendSuccess = useAppendSuccess();
	const removeKnowledges = useRemoveKnowledges();
	const [isDeleting, setIsDeleting] = useState(false);

	const deleteHandler = useCallback(
		async (file: string) => {
			setIsDeleting(true);

			try {
				const isDeleted = await deleteKnowledges(file, "dummy_index");
				removeKnowledges(file);
				appendSuccess(isDeleted);
			} catch (err) {
				const errMsg =
					err instanceof Error ? err.message : `Failed to delete ${file}`;
				appendError(errMsg);
			} finally {
				setIsDeleting(false);
			}
		},
		[deleteKnowledges, appendError, appendSuccess, removeKnowledges],
	);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant={"destructive"}
					size={"icon-sm"}
					className="cursor-pointer"
					disabled={isDeleting}
				>
					{isDeleting ? (
						<Spinner className="h-4 w-4" />
					) : (
						<EraserIcon className="h-4 w-4" />
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						If you delete this knowledge, AI will never refer to this knowledge!
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant={"destructive"}
						onClick={() => deleteHandler(file)}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function KnowledgeTableViewButton({ filename }: { filename: string }) {
	const [openModal, setOpenModal] = useState<boolean>(false);

	return (
		<>
			<Button
				variant={"outline"}
				size={"icon-sm"}
				className="cursor-pointer"
				onClick={() => setOpenModal(true)}
			>
				<Eye className="h-4 w-4" />
			</Button>
			<FileReferenceModal
				onOpen={openModal}
				setOnOpen={setOpenModal}
				refName={filename}
				refSourceName={filename}
			/>
		</>
	);
}

export function KnowledgeManagementTable() {
	const knowledges = useKnowledges();
	const fetchNext = useFetchNextKnowledges();
	const fetchPrevious = useFetchPreviousKnowledges();
	const setPageSize = useSetKnowledgePageSize();
	const isLoading = useKnowledgeLoading();
	const hasNext = useKnowledgeHasNext();
	const hasPrevious = useKnowledgeHasPrevious();
	const isLoadingNext = useKnowledgeLoadingNext();
	const isLoadingPrevious = useKnowledgeLoadingPrevious();
	const currentPage = useKnowledgeCurrentPage();
	const totalPages = useKnowledgeTotalPages();
	const paginationMode = useKnowledgePaginationMode();
	const isSearching = useKnowledgeIsSearching();
	const searchKnowledges = useSearchKnowledges();
	const isPageMode = paginationMode === "page";
	const error = useKnowledgeError();
	const clearError = useClearKnowledgeError();
	const appendError = useAppendError();
	useEffect(() => {
		if (error) {
			appendError(error || "Something went wrong, please try again later");
		}
		return () => {
			clearError();
		};
	}, [error, appendError, clearError]);
	return (
		<ComponentDataTable
			size="sm"
			data={knowledges}
			columns={KnowledgeManagementColumns}
			enablePagination={true}
			cursorBasedPagination={true} // false for page mode
			cursorConfig={{
				hasNext: isPageMode ? currentPage < totalPages : hasNext,
				hasPrevious: isPageMode ? currentPage > 1 : hasPrevious,
				onNext: fetchNext,
				onPrevious: fetchPrevious,
				isLoading: isLoading || isLoadingNext || isLoadingPrevious,
				onPageSizeChange: (pageSize) => {
					setPageSize(pageSize);
				},
			}}
			searchPlaceholder="Search file here"
			enableSearch={true}
			serverSideSearch={true}
			onSearch={searchKnowledges}
			isSearching={isSearching}
		/>
	);
}

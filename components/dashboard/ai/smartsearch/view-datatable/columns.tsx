"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { SmartSearchGroupSchema } from "@/lib/type/smartsearch";
import { Button } from "@/components/ui/button";
import { EyeIcon, TrashIcon } from "lucide-react";
import { formattedDateToDDMMYYYY } from "@/lib/utils";
import { SchemaDetailModal } from "../schema-detail-modal";
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
} from "@/components/ui/alert-dialog";
import { useDeleteGroupSchema, useIsDeletingGroup } from "@/hooks/useSmartsearch";
import { Spinner } from "@/components/ui/spinner";

// ActionCell component to handle the modal state
function ActionCell({ schema }: { schema: SmartSearchGroupSchema }) {
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const deleteGroup = useDeleteGroupSchema();
	const isDeleting = useIsDeletingGroup();

	const handleDelete = async () => {
		await deleteGroup(schema.id);
	};

	return (
		<>
			<div className="flex gap-2">
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => setIsDetailOpen(true)}
					title="View Details"
				>
					<EyeIcon className="h-4 w-4" />
				</Button>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon-sm"
							className="text-destructive hover:text-destructive"
							title="Delete Group"
						>
							<TrashIcon className="h-4 w-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Schema Group</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete the schema group &quot;
								{schema.name}&quot;? This will also delete all{" "}
								{schema.field_schemas.length} field(s). This action cannot be
								undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								disabled={isDeleting}
							>
								{isDeleting ? (
									<Spinner className="h-4 w-4" />
								) : (
									"Delete"
								)}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<SchemaDetailModal
				schema={schema}
				isOpen={isDetailOpen}
				onClose={() => setIsDetailOpen(false)}
			/>
		</>
	);
}

export const columns: ColumnDef<SmartSearchGroupSchema>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		header: "Fields",
		cell: ({ row }) => {
			return row.original.field_schemas.length;
		},
	},
	{
		header: "Created",
		cell: ({ row }) => {
			return formattedDateToDDMMYYYY(row.original.created_at);
		},
	},
	{
		header: "Actions",
		id: "actions",
		cell: ({ row }) => {
			return <ActionCell schema={row.original} />;
		},
	},
];

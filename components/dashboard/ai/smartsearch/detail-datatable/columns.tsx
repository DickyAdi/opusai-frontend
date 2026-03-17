"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SmartSearchFieldSchema } from "@/lib/type/smartsearch";
import { ActionCell } from "./action-cell";

interface FieldColumnProps {
	onEdit: (field: SmartSearchFieldSchema) => void;
	onDelete: (fieldId: string) => void;
	isLoading: boolean;
	isEditing: boolean;
}

export function getFieldColumns({
	onEdit,
	onDelete,
	isLoading,
	isEditing,
}: FieldColumnProps): ColumnDef<SmartSearchFieldSchema>[] {
	return [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "type",
			header: "Type",
		},
		{
			header: "Description",
			cell: ({ row }) => (
				<span className="truncate max-w-xs block">
					{row.original.description}
				</span>
			),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<ActionCell
					field={row.original}
					onEdit={onEdit}
					onDelete={onDelete}
					isLoading={isLoading}
					isEditing={isEditing}
				/>
			),
		},
	];
}

"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import type { SmartSearchFieldSchema } from "@/lib/type/smartsearch";
import { FieldDeleteAlert } from "./field-delete-alert";

interface ActionCellProps {
	field: SmartSearchFieldSchema;
	onEdit: (field: SmartSearchFieldSchema) => void;
	onDelete: (fieldId: string) => void;
	isLoading: boolean;
	isEditing: boolean;
}

export function ActionCell({
	field,
	onEdit,
	onDelete,
	isLoading,
	isEditing,
}: ActionCellProps) {
	return (
		<div className="flex gap-2">
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={() => onEdit(field)}
				disabled={isLoading || isEditing}
			>
				<PencilIcon className="h-4 w-4" />
			</Button>
			<FieldDeleteAlert
				field={field}
				onDelete={onDelete}
				disabled={isLoading || isEditing}
			/>
		</div>
	);
}

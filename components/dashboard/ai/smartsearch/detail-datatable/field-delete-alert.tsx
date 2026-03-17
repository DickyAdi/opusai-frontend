"use client";

import { Button } from "@/components/ui/button";
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
import { TrashIcon } from "lucide-react";
import type { SmartSearchFieldSchema } from "@/lib/type/smartsearch";

interface FieldDeleteAlertProps {
	field: SmartSearchFieldSchema;
	onDelete: (fieldId: string) => void;
	disabled?: boolean;
}

export function FieldDeleteAlert({
	field,
	onDelete,
	disabled = false,
}: FieldDeleteAlertProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="icon-sm" disabled={disabled}>
					<TrashIcon className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Field</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the field &quot;{field.name}&quot;? This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => onDelete(field.id)}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

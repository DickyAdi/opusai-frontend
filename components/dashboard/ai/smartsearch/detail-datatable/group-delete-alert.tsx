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
import { Spinner } from "@/components/ui/spinner";
import type { SmartSearchGroupSchema } from "@/lib/type/smartsearch";

interface GroupDeleteAlertProps {
	schema: SmartSearchGroupSchema;
	onDelete: () => void;
	isLoading: boolean;
}

export function GroupDeleteAlert({
	schema,
	onDelete,
	isLoading,
}: GroupDeleteAlertProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="sm" disabled={isLoading}>
					<TrashIcon className="h-4 w-4 mr-1" />
					Delete Group
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Schema Group</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the schema group &quot;{schema.name}&quot;?
						This will also delete all {schema.field_schemas.length} field(s). This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onDelete}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={isLoading}
					>
						{isLoading ? <Spinner className="h-4 w-4" /> : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

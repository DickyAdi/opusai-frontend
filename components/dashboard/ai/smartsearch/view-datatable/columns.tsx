"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SmartSearchGroupSchema } from "@/lib/type/smartsearch";
import { Button } from "@/components/ui/button";
import { EraserIcon, PencilIcon } from "lucide-react";
import { formattedDateToDDMMYYYY } from "@/lib/utils";

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
			const data = row.original;

			return (
				<div className="flex gap-2">
					<Button
						variant={"ghost"}
						className="h-8 w-8"
						onClick={() => {
							console.log(`Edit button clicked for ${data.name}`);
						}}
					>
						<PencilIcon className="h-4 w-4" />
					</Button>
					<Button
						variant={"ghost"}
						className="h-8 w-8"
						onClick={() => {
							console.log(`Delete button clicked for ${data.name}`);
						}}
					>
						<EraserIcon className="h-4 w-4" />
					</Button>
				</div>
			);
		},
	},
];

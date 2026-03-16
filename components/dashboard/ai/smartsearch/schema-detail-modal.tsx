"use client";

import { useState, useCallback, ChangeEvent } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupInput,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { ComponentDataTable } from "@/components/ui/data-table";

import type { ColumnDef } from "@tanstack/react-table";
import {
	useAddFieldsToGroup,
	useDeleteGroupSchema,
	useEditFieldSchema,
	useDeleteFieldSchema,
	useIsAddingField,
	useIsDeletingGroup,
	useIsEditingField,
	useIsDeletingField,
} from "@/hooks/useSmartsearch";
import type {
	SmartSearchGroupSchema,
	SmartSearchFieldSchema,
	FieldType,
} from "@/lib/type/smartsearch";
import { FieldTypeValue } from "@/lib/type/smartsearch";
import { FieldSchemaValidation } from "@/lib/validator/smartsearch-schema/create";
import { PlusIcon, PencilIcon, TrashIcon, XIcon, SaveIcon } from "lucide-react";
import { formattedDateToDDMMYYYY } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface SchemaDetailModalProps {
	schema: SmartSearchGroupSchema | null;
	isOpen: boolean;
	onClose: () => void;
}

interface EditingField {
	id: string;
	name: string;
	description: string;
	type: FieldType;
}

interface NewField {
	name: string;
	description: string;
	type: FieldType;
}

export function SchemaDetailModal({
	schema,
	isOpen,
	onClose,
}: SchemaDetailModalProps) {
	const [isAddingField, setIsAddingField] = useState(false);
	const [editingField, setEditingField] = useState<EditingField | null>(null);
	const [newField, setNewField] = useState<NewField>({
		name: "",
		description: "",
		type: FieldTypeValue[0],
	});
	const [newFieldErrors, setNewFieldErrors] = useState<{
		name?: string;
		description?: string;
	}>({});
	const [editFieldErrors, setEditFieldErrors] = useState<{
		name?: string;
		description?: string;
	}>({});

	const addFieldsToGroup = useAddFieldsToGroup();
	const deleteGroup = useDeleteGroupSchema();
	const editField = useEditFieldSchema();
	const deleteField = useDeleteFieldSchema();
	const isAddingFieldLoading = useIsAddingField();
	const isDeletingGroupLoading = useIsDeletingGroup();
	const isEditingFieldLoading = useIsEditingField();
	const isDeletingFieldLoading = useIsDeletingField();

	const isLoading =
		isAddingFieldLoading ||
		isDeletingGroupLoading ||
		isEditingFieldLoading ||
		isDeletingFieldLoading;

	const handleAddField = useCallback(async () => {
		if (!schema) return;

		// Validate
		const result = FieldSchemaValidation.pick({
			name: true,
			description: true,
			type: true,
		}).safeParse(newField);

		if (!result.success) {
			const errors: { name?: string; description?: string } = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as "name" | "description";
				errors[field] = issue.message;
			});
			setNewFieldErrors(errors);
			return;
		}

		const success = await addFieldsToGroup(schema.id, [newField]);
		if (success) {
			setNewField({ name: "", description: "", type: FieldTypeValue[0] });
			setNewFieldErrors({});
			setIsAddingField(false);
		}
	}, [schema, newField, addFieldsToGroup]);

	const handleDeleteGroup = useCallback(async () => {
		if (!schema) return;
		const success = await deleteGroup(schema.id);
		if (success) {
			onClose();
		}
	}, [schema, deleteGroup, onClose]);

	const handleEditField = useCallback(async () => {
		if (!editingField) return;

		// Validate
		const result = FieldSchemaValidation.pick({
			name: true,
			description: true,
			type: true,
		}).safeParse(editingField);

		if (!result.success) {
			const errors: { name?: string; description?: string } = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as "name" | "description";
				errors[field] = issue.message;
			});
			setEditFieldErrors(errors);
			return;
		}

		const success = await editField(editingField.id, {
			name: editingField.name,
			description: editingField.description,
			type: editingField.type,
		});
		if (success) {
			setEditingField(null);
			setEditFieldErrors({});
		}
	}, [editingField, editField]);

	const handleDeleteField = useCallback(
		async (fieldId: string) => {
			await deleteField(fieldId);
		},
		[deleteField],
	);

	const startEditingField = useCallback((field: SmartSearchFieldSchema) => {
		setEditingField({
			id: field.id,
			name: field.name,
			description: field.description,
			type: field.type,
		});
		setEditFieldErrors({});
	}, []);

	const cancelEditingField = useCallback(() => {
		setEditingField(null);
		setEditFieldErrors({});
	}, []);

	const updateNewFieldName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewField((prev) => ({ ...prev, name: value }));
		// Clear error on change
		setNewFieldErrors((prev) => ({ ...prev, name: undefined }));
	}, []);

	const updateNewFieldDescription = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			setNewField((prev) => ({ ...prev, description: value }));
			setNewFieldErrors((prev) => ({ ...prev, description: undefined }));
		},
		[],
	);

	const updateEditingFieldName = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setEditingField((prev) => (prev ? { ...prev, name: value } : null));
			setEditFieldErrors((prev) => ({ ...prev, name: undefined }));
		},
		[],
	);

	const updateEditingFieldDescription = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			setEditingField((prev) =>
				prev ? { ...prev, description: value } : null,
			);
			setEditFieldErrors((prev) => ({ ...prev, description: undefined }));
		},
		[],
	);

	const fieldColumns: ColumnDef<SmartSearchFieldSchema>[] = [
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
			cell: ({ row }) => {
				const field = row.original;
				return (
					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => startEditingField(field)}
							disabled={isLoading || editingField !== null}
						>
							<PencilIcon className="h-4 w-4" />
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="icon-sm"
									disabled={isLoading || editingField !== null}
								>
									<TrashIcon className="h-4 w-4" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Field</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete the field &quot;
										{field.name}&quot;? This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => handleDeleteField(field.id)}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				);
			},
		},
	];

	if (!schema) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-5xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle>{schema.name}</DialogTitle>
					<DialogDescription>{schema.description}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll">
					<div className="space-y-4 p-6">
						{/* Group Info */}
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-muted-foreground">Created:</span>{" "}
								{formattedDateToDDMMYYYY(schema.created_at)}
							</div>
							<div>
								<span className="text-muted-foreground">Updated:</span>{" "}
								{formattedDateToDDMMYYYY(schema.updated_at)}
							</div>
						</div>

						{/* Fields Table */}
						<div>
							<h3 className="text-sm font-medium mb-2">Fields</h3>
							<ComponentDataTable
								data={schema.field_schemas}
								columns={fieldColumns}
								size="sm"
								scrollable="both"
							/>
						</div>

						{/* Edit Field Form */}
						{editingField && (
							<div className="border rounded-lg p-4 space-y-3">
								<div className="flex justify-between items-center">
									<h4 className="text-sm font-medium">Edit Field</h4>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={cancelEditingField}
										disabled={isEditingFieldLoading}
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<Label className="text-xs">Field Name</Label>
										<InputGroup>
											<InputGroupInput
												value={editingField.name}
												onChange={updateEditingFieldName}
												className={`text-xs ${editFieldErrors.name ? "border-destructive" : ""}`}
												disabled={isEditingFieldLoading}
											/>
										</InputGroup>
										{editFieldErrors.name && (
											<span className="text-xs text-destructive">
												{editFieldErrors.name}
											</span>
										)}
									</div>
									<div>
										<Label className="text-xs">Field Type</Label>
										<Combobox
											items={FieldTypeValue}
											value={editingField.type}
											onValueChange={(value) =>
												setEditingField((prev) =>
													prev ? { ...prev, type: value as FieldType } : null,
												)
											}
										>
											<ComboboxInput
												placeholder="Select type"
												className="text-xs"
												disabled={isEditingFieldLoading}
											/>
											<ComboboxContent side="top">
												<ComboboxList>
													{(item: FieldType) => (
														<ComboboxItem
															key={item}
															value={item}
															className="text-xs"
														>
															{item}
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
									</div>
								</div>
								<div>
									<Label className="text-xs">Description</Label>
									<InputGroup>
										<InputGroupTextarea
											value={editingField.description}
											onChange={updateEditingFieldDescription}
											className={`text-xs min-h-16 max-h-24 ${editFieldErrors.description ? "border-destructive" : ""}`}
											disabled={isEditingFieldLoading}
										/>
									</InputGroup>
									{editFieldErrors.description && (
										<span className="text-xs text-destructive">
											{editFieldErrors.description}
										</span>
									)}
								</div>
								<div className="flex justify-end">
									<Button
										size="sm"
										onClick={handleEditField}
										disabled={isEditingFieldLoading}
									>
										{isEditingFieldLoading ? (
											<Spinner className="h-4 w-4" />
										) : (
											<>
												<SaveIcon className="h-4 w-4 mr-1" />
												Save
											</>
										)}
									</Button>
								</div>
							</div>
						)}

						{/* Add Field Form - same width as table */}
						{isAddingField && (
							<div className="border rounded-lg p-4 space-y-3">
								<div className="flex justify-between items-center">
									<h4 className="text-sm font-medium">Add New Field</h4>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => {
											setIsAddingField(false);
											setNewField({
												name: "",
												description: "",
												type: FieldTypeValue[0],
											});
											setNewFieldErrors({});
										}}
										disabled={isAddingFieldLoading}
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<Label className="text-xs">Field Name</Label>
										<InputGroup>
											<InputGroupInput
												value={newField.name}
												onChange={updateNewFieldName}
												placeholder="e.g., harga_transaksi"
												className={`text-xs ${newFieldErrors.name ? "border-destructive" : ""}`}
												disabled={isAddingFieldLoading}
											/>
										</InputGroup>
										{newFieldErrors.name && (
											<span className="text-xs text-destructive">
												{newFieldErrors.name}
											</span>
										)}
									</div>
									<div>
										<Label className="text-xs">Field Type</Label>
										<Combobox
											items={FieldTypeValue}
											value={newField.type}
											onValueChange={(value) =>
												setNewField((prev) => ({
													...prev,
													type: value as FieldType,
												}))
											}
										>
											<ComboboxInput
												placeholder="Select type"
												className="text-xs"
												disabled={isAddingFieldLoading}
											/>
											<ComboboxContent side="top">
												<ComboboxList>
													{(item: FieldType) => (
														<ComboboxItem
															key={item}
															value={item}
															className="text-xs"
														>
															{item}
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
									</div>
								</div>
								<div>
									<Label className="text-xs">Description</Label>
									<InputGroup>
										<InputGroupTextarea
											value={newField.description}
											onChange={updateNewFieldDescription}
											placeholder="Describe what this field represents..."
											className={`text-xs min-h-16 max-h-24 ${newFieldErrors.description ? "border-destructive" : ""}`}
											disabled={isAddingFieldLoading}
										/>
									</InputGroup>
									{newFieldErrors.description && (
										<span className="text-xs text-destructive">
											{newFieldErrors.description}
										</span>
									)}
								</div>
								<div className="flex justify-end">
									<Button
										size="sm"
										onClick={handleAddField}
										disabled={isAddingFieldLoading}
									>
										{isAddingFieldLoading ? (
											<Spinner className="h-4 w-4" />
										) : (
											<>
												<PlusIcon className="h-4 w-4 mr-1" />
												Add Field
											</>
										)}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="p-6 pt-0 gap-2">
					{!isAddingField && !editingField && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsAddingField(true)}
							disabled={isLoading}
						>
							<PlusIcon className="h-4 w-4 mr-1" />
							Add Field
						</Button>
					)}

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
									Are you sure you want to delete the schema group &quot;
									{schema.name}&quot;? This will also delete all{" "}
									{schema.field_schemas.length} field(s). This action cannot be
									undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteGroup}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									{isDeletingGroupLoading ? (
										<Spinner className="h-4 w-4" />
									) : (
										"Delete"
									)}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

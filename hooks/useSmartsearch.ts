import { fetchSmartSearchSchema } from "@/lib/api/smartsearch";
import type {
	FetchSmartSearchSchemaResponse,
	SmartSearchFieldInputNoId,
	SmartSearchFieldInput,
} from "@/lib/type/smartsearch";
import { useEffect, useState, useCallback } from "react";
import { useAppendError } from "./useError";
import {
	smartSearchSchemaCreateStore,
	smartSearchSchemaStore,
	smartSearchStore,
	smartSearchSchemaManageStore,
} from "@/lib/store/smartsearch_store";
import { useAppendSuccess } from "./useSuccess";

export function useFetchSchema() {
	const [schemas, setSchemas] = useState<FetchSmartSearchSchemaResponse>({
		schemas: [],
	});
	const [loading, setIsLoading] = useState(false);
	const [error, setIsError] = useState(false);
	const appendError = useAppendError();

	useEffect(() => {
		const fetcher = async () => {
			try {
				setIsLoading(true);
				const data = await fetchSmartSearchSchema();
				setSchemas(data);
			} catch (err) {
				setIsError(true);
				appendError(
					err instanceof Error ? err.message : "Failed to fetch search schemas",
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetcher();
	}, [appendError]);

	return {
		schemas,
		isLoading: loading,
		isError: error,
	};
}

export function useSmartSearch() {
	return smartSearchStore((state) => state.search);
}

export function useGetSearchHits() {
	return smartSearchStore((state) => state.hits);
}

export function useGetIsSearching() {
	return smartSearchStore((state) => state.isSearching);
}

export function useGetSetIsSearching() {
	return smartSearchStore((state) => state.setIsSearching);
}

export function useSmartSearchSchemas() {
	return smartSearchSchemaStore((state) => state.schemas);
}

export function useLoadSmartSearchSchemas() {
	return smartSearchSchemaStore((state) => state.loadSchemas);
}

export function useSmartSearchSchemaGroups() {
	return smartSearchSchemaCreateStore((state) => state.groups);
}

export function useSmartSearchSchemaCreateGroup() {
	return smartSearchSchemaCreateStore((state) => state.createGroup);
}

export function useSmartSearchSchemaUpdateGroup() {
	return smartSearchSchemaCreateStore((state) => state.updateGroup);
}

export function useSmartSearchSchemaDeleteGroup() {
	return smartSearchSchemaCreateStore((state) => state.deleteGroup);
}

export function useSmartSearchSchemaCreateField() {
	return smartSearchSchemaCreateStore((state) => state.createField);
}

export function useSmartSearchSchemaUpdateField() {
	return smartSearchSchemaCreateStore((state) => state.updateField);
}

export function useSmartSearchSchemaDeleteField() {
	return smartSearchSchemaCreateStore((state) => state.deleteField);
}

export function useSmartSearchSchemaSave() {
	return smartSearchSchemaCreateStore((state) => state.saveSchema);
}

export function useSmartSearchSchemaErrors() {
	return smartSearchSchemaCreateStore((state) => state.errors);
}

export function useSmartSearchSchemaSetGroupError() {
	return smartSearchSchemaCreateStore((state) => state.setGroupError);
}

export function useSmartSearchSchemaClearGroupError() {
	return smartSearchSchemaCreateStore((state) => state.clearGroupError);
}

export function useSmartSearchSchemaClearGroupErrors() {
	return smartSearchSchemaCreateStore((state) => state.clearGroupErrors);
}

export function useSmartSearchSchemaSetFieldError() {
	return smartSearchSchemaCreateStore((state) => state.setFieldError);
}

export function useSmartSearchSchemaClearFieldError() {
	return smartSearchSchemaCreateStore((state) => state.clearFieldError);
}

export function useSmartSearchSchemaValidateGroup() {
	return smartSearchSchemaCreateStore((state) => state.validateGroup);
}

export function useSmartSearchSchemaValidateField() {
	return smartSearchSchemaCreateStore((state) => state.validateField);
}

export function useSmartSearchSchemaValidateAll() {
	return smartSearchSchemaCreateStore((state) => state.validateAll);
}

export function useSmartSearchSchemaGetGroupErrors(groupId: string) {
	return smartSearchSchemaCreateStore((state) => state.getGroupErrors(groupId));
}

export function useSmartSearchSchemaGetFieldErrors(
	groupId: string,
	fieldId: string,
) {
	return smartSearchSchemaCreateStore((state) =>
		state.getFieldErrors(groupId, fieldId),
	);
}

export function useSmartSearchSchemaGetIsSaving() {
	return smartSearchSchemaCreateStore((state) => state.saving);
}

export function useSmartSearchSchemaSetIsSaving() {
	return smartSearchSchemaCreateStore((state) => state.setIsSaving);
}

// === Hooks for managing existing schemas ===

export function useAddFieldsToGroup() {
	const addFields = smartSearchSchemaManageStore((state) => state.addFieldsToGroup);
	const isAddingField = smartSearchSchemaManageStore((state) => state.isAddingField);
	const appendSuccess = useAppendSuccess();
	const appendError = useAppendError();
	const loadSchemas = useLoadSmartSearchSchemas();

	return useCallback(
		async (groupId: string, fields: SmartSearchFieldInputNoId[]) => {
			try {
				const message = await addFields(groupId, fields);
				appendSuccess(message);
				await loadSchemas();
				return true;
			} catch (err) {
				appendError(err instanceof Error ? err.message : "Failed to add fields");
				return false;
			}
		},
		[addFields, appendSuccess, appendError, loadSchemas],
	);
}

export function useDeleteGroupSchema() {
	const deleteGroup = smartSearchSchemaManageStore((state) => state.deleteGroup);
	const isDeletingGroup = smartSearchSchemaManageStore((state) => state.isDeletingGroup);
	const appendSuccess = useAppendSuccess();
	const appendError = useAppendError();
	const loadSchemas = useLoadSmartSearchSchemas();

	return useCallback(
		async (groupId: string) => {
			try {
				const message = await deleteGroup(groupId);
				appendSuccess(message);
				await loadSchemas();
				return true;
			} catch (err) {
				appendError(err instanceof Error ? err.message : "Failed to delete group");
				return false;
			}
		},
		[deleteGroup, appendSuccess, appendError, loadSchemas],
	);
}

export function useEditFieldSchema() {
	const editField = smartSearchSchemaManageStore((state) => state.editField);
	const isEditingField = smartSearchSchemaManageStore((state) => state.isEditingField);
	const appendSuccess = useAppendSuccess();
	const appendError = useAppendError();
	const loadSchemas = useLoadSmartSearchSchemas();

	return useCallback(
		async (
			fieldId: string,
			updates: Partial<Pick<SmartSearchFieldInput, "name" | "description" | "type">>,
		) => {
			try {
				const message = await editField(fieldId, updates);
				appendSuccess(message);
				await loadSchemas();
				return true;
			} catch (err) {
				appendError(err instanceof Error ? err.message : "Failed to edit field");
				return false;
			}
		},
		[editField, appendSuccess, appendError, loadSchemas],
	);
}

export function useDeleteFieldSchema() {
	const deleteField = smartSearchSchemaManageStore((state) => state.deleteField);
	const isDeletingField = smartSearchSchemaManageStore((state) => state.isDeletingField);
	const appendSuccess = useAppendSuccess();
	const appendError = useAppendError();
	const loadSchemas = useLoadSmartSearchSchemas();

	return useCallback(
		async (fieldId: string) => {
			try {
				const message = await deleteField(fieldId);
				appendSuccess(message);
				await loadSchemas();
				return true;
			} catch (err) {
				appendError(err instanceof Error ? err.message : "Failed to delete field");
				return false;
			}
		},
		[deleteField, appendSuccess, appendError, loadSchemas],
	);
}

export function useIsAddingField() {
	return smartSearchSchemaManageStore((state) => state.isAddingField);
}

export function useIsDeletingGroup() {
	return smartSearchSchemaManageStore((state) => state.isDeletingGroup);
}

export function useIsEditingField() {
	return smartSearchSchemaManageStore((state) => state.isEditingField);
}

export function useIsDeletingField() {
	return smartSearchSchemaManageStore((state) => state.isDeletingField);
}

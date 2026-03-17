import { nanoid } from "nanoid";
import { create } from "zustand";
import {
	fetchSmartSearchSchema,
	smartSearch,
	smartSearchCreateSchema,
	addFieldToGroupSchema,
	deleteGroupSchema,
	editFieldSchema,
	deleteFieldSchema,
} from "../api/smartsearch";
import {
	type SearchEngineHits,
	type SmartSearchFieldInput,
	type SmartSearchGroupInput,
	type SmartSearchGroupSchema,
	type FieldType,
	FieldTypeValue,
	type SmartSearchFieldInputNoId,
} from "../type/smartsearch";
import {
	FieldSchemaValidation,
	GroupSchemaValidation,
} from "../validator/smartsearch-schema/create";

interface SmartsearchStoreState {
	hits: SearchEngineHits[];
	isSearching: boolean;
	search: (search_query: string) => Promise<void>;
	setIsSearching: (value: boolean) => void;
}

interface SmartSearchSchemaStoreState {
	schemas: SmartSearchGroupSchema[];
	loadSchemas: () => Promise<void>;
}

export const smartSearchStore = create<SmartsearchStoreState>((set, get) => ({
	hits: [],
	isSearching: false,
	search: async (search_query: string) => {
		if (!search_query) return;

		get().setIsSearching(true);
		try {
			const data = await smartSearch(search_query);
			console.log(data);
			set({ hits: data.hits });
		} catch (err) {
			console.error("Cannot perform smart search", err);
		} finally {
			get().setIsSearching(false);
		}
	},
	setIsSearching: (value: boolean) => set({ isSearching: value }),
}));

export const smartSearchSchemaStore = create<SmartSearchSchemaStoreState>(
	(set) => ({
		schemas: [],
		loadSchemas: async () => {
			const response = await fetchSmartSearchSchema();
			set({ schemas: response.schemas });
		},
	}),
);

type GroupErrorKey = "name" | "description";
type FieldErrorKey = "name" | "description" | "type";

interface FieldErrors {
	name?: string;
	description?: string;
	type?: string;
}

interface GroupErrors {
	name?: string;
	description?: string;
	fields?: Record<string, FieldErrors>; // fieldId -> errors
}

interface SmartSearchSchemaCreateStoreState {
	groups: SmartSearchGroupInput[];
	errors: Record<string, GroupErrors>; // groupId -> GroupErrors
	saving: boolean;

	setIsSaving: (e: boolean) => void;
	// Existing methods
	createGroup: () => string;
	deleteGroup: (groupId: string) => void;
	updateGroup: (
		groupId: string,
		updates: Partial<Pick<SmartSearchGroupInput, "description" | "name">>,
	) => void;
	createField: (groupId: string) => string;
	deleteField: (groupId: string, fieldId: string) => void;
	updateField: (
		groupId: string,
		fieldId: string,
		updates: Partial<
			Pick<SmartSearchFieldInput, "description" | "name" | "type">
		>,
	) => void;
	// saveSchema: (groups: SmartSearchGroupInput) => Promise<void>;
	saveSchema: (groupId: string) => Promise<string>;

	// Error management
	setGroupError: (
		groupId: string,
		field: GroupErrorKey,
		message: string,
	) => void;
	clearGroupError: (groupId: string, field: GroupErrorKey) => void;
	setFieldError: (
		groupId: string,
		fieldId: string,
		field: FieldErrorKey,
		message: string,
	) => void;
	clearFieldError: (
		groupId: string,
		fieldId: string,
		field: FieldErrorKey,
	) => void;
	clearGroupErrors: (groupId: string) => void;
	validateGroup: (groupId: string) => boolean; // Validates group-level fields only
	validateField: (groupId: string, fieldId: string) => boolean;
	validateAll: () => boolean; // Validates everything before save
	getGroupErrors: (groupId: string) => GroupErrors | undefined;
	getFieldErrors: (groupId: string, fieldId: string) => FieldErrors | undefined;
}

export const smartSearchSchemaCreateStore =
	create<SmartSearchSchemaCreateStoreState>((set, get) => ({
		groups: [],
		errors: {},
		saving: false,

		setIsSaving: (e: boolean) => set({ saving: e }),
		createGroup: () => {
			const groupId = nanoid();
			const newGroup: SmartSearchGroupInput = {
				id: groupId,
				name: "",
				description: "",
				fields: [],
			};
			set((state) => ({ groups: [newGroup, ...state.groups] }));
			return groupId;
		},

		deleteGroup: (groupId: string) => {
			set((state) => {
				// Remove group
				const newGroups = state.groups.filter((group) => group.id !== groupId);
				// Remove all errors for this group
				const { [groupId]: _, ...remainingErrors } = state.errors;
				return { groups: newGroups, errors: remainingErrors };
			});
		},

		updateGroup: (groupId, updates) => {
			set((state) => ({
				groups: state.groups.map((group) =>
					group.id === groupId ? { ...group, ...updates } : group,
				),
			}));
		},

		createField: (groupId: string) => {
			const fieldId = nanoid();
			const firstTypeValue = FieldTypeValue[0];
			const newField: SmartSearchFieldInput = {
				id: fieldId,
				name: "",
				description: "",
				type: firstTypeValue,
			};
			set((state) => ({
				groups: state.groups.map((group) =>
					group.id === groupId
						? { ...group, fields: [...group.fields, newField] }
						: group,
				),
			}));
			return fieldId;
		},

		deleteField: (groupId: string, fieldId: string) => {
			set((state) => {
				// Update groups
				const newGroups = state.groups.map((group) =>
					group.id === groupId
						? {
								...group,
								fields: group.fields.filter((field) => field.id !== fieldId),
							}
						: group,
				);

				// Clean up field errors
				const groupErrors = state.errors[groupId];
				if (groupErrors?.fields?.[fieldId]) {
					const { [fieldId]: _, ...remainingFieldErrors } = groupErrors.fields;
					return {
						groups: newGroups,
						errors: {
							...state.errors,
							[groupId]: {
								...groupErrors,
								fields: remainingFieldErrors,
							},
						},
					};
				}

				return { groups: newGroups };
			});
		},

		updateField: (groupId, fieldId, updates) => {
			set((state) => ({
				groups: state.groups.map((group) =>
					group.id === groupId
						? {
								...group,
								fields: group.fields.map((field) =>
									field.id === fieldId ? { ...field, ...updates } : field,
								),
							}
						: group,
				),
			}));
		},

		// Error Management Implementation
		setGroupError: (groupId, field, message) => {
			set((state) => ({
				errors: {
					...state.errors,
					[groupId]: {
						...state.errors[groupId],
						[field]: message,
					},
				},
			}));
		},

		clearGroupError: (groupId, field) => {
			set((state) => {
				const groupErrors = state.errors[groupId];
				if (!groupErrors) return state;

				const newGroupErrors = { ...groupErrors };
				delete newGroupErrors[field];

				// Clean up empty group errors object
				if (
					Object.keys(newGroupErrors).length === 0 ||
					(Object.keys(newGroupErrors).length === 1 &&
						newGroupErrors.fields &&
						Object.keys(newGroupErrors.fields).length === 0)
				) {
					const { [groupId]: _, ...rest } = state.errors;
					return { errors: rest };
				}

				return {
					errors: {
						...state.errors,
						[groupId]: newGroupErrors,
					},
				};
			});
		},

		setFieldError: (groupId, fieldId, field, message) => {
			set((state) => ({
				errors: {
					...state.errors,
					[groupId]: {
						...state.errors[groupId],
						fields: {
							...state.errors[groupId]?.fields,
							[fieldId]: {
								...state.errors[groupId]?.fields?.[fieldId],
								[field]: message,
							},
						},
					},
				},
			}));
		},

		clearFieldError: (groupId, fieldId, field) => {
			set((state) => {
				const fieldErrors = state.errors[groupId]?.fields?.[fieldId];
				if (!fieldErrors) return state;

				const newFieldErrors = { ...fieldErrors };
				delete newFieldErrors[field];

				// Clean up empty field errors
				const groupFields = state.errors[groupId]?.fields;
				if (Object.keys(newFieldErrors).length === 0) {
					const { [fieldId]: _, ...remainingFields } = groupFields || {};
					return {
						errors: {
							...state.errors,
							[groupId]: {
								...state.errors[groupId],
								fields: remainingFields,
							},
						},
					};
				}

				return {
					errors: {
						...state.errors,
						[groupId]: {
							...state.errors[groupId],
							fields: {
								...groupFields,
								[fieldId]: newFieldErrors,
							},
						},
					},
				};
			});
		},

		clearGroupErrors: (groupId) => {
			set((state) => {
				const { [groupId]: _, ...rest } = state.errors;
				return { errors: rest };
			});
		},

		// Validation Methods
		validateGroup: (groupId) => {
			const group = get().groups.find((g) => g.id === groupId);
			if (!group) return false;

			const GroupSchema = GroupSchemaValidation.pick({
				name: true,
				description: true,
			});
			const result = GroupSchema.safeParse({
				name: group.name,
				description: group.description,
			});

			if (!result.success) {
				result.error.issues.forEach((issue) => {
					const field = issue.path[0] as GroupErrorKey;
					get().setGroupError(groupId, field, issue.message);
				});
				return false;
			}

			// Clear existing group-level errors if valid
			get().clearGroupError(groupId, "name");
			get().clearGroupError(groupId, "description");
			return true;
		},

		validateField: (groupId, fieldId) => {
			const group = get().groups.find((g) => g.id === groupId);
			const field = group?.fields.find((f) => f.id === fieldId);
			if (!field) return false;

			const FieldSchema = FieldSchemaValidation.pick({
				name: true,
				description: true,
				type: true,
			});
			const result = FieldSchema.safeParse(field);

			if (!result.success) {
				result.error.issues.forEach((issue) => {
					const fieldKey = issue.path[0] as FieldErrorKey;
					get().setFieldError(groupId, fieldId, fieldKey, issue.message);
				});
				return false;
			}

			// Clear errors for this field
			["name", "description", "type"].forEach((key) => {
				get().clearFieldError(groupId, fieldId, key as FieldErrorKey);
			});
			return true;
		},

		validateAll: () => {
			const { groups } = get();
			let isValid = true;

			groups.forEach((group) => {
				const groupValid = get().validateGroup(group.id);
				if (!groupValid) isValid = false;

				group.fields.forEach((field) => {
					const fieldValid = get().validateField(group.id, field.id);
					if (!fieldValid) isValid = false;
				});
			});

			return isValid;
		},

		getGroupErrors: (groupId) => get().errors[groupId],
		getFieldErrors: (groupId, fieldId) =>
			get().errors[groupId]?.fields?.[fieldId],

		saveSchema: async (groupId: string) => {
			const isValid = get().validateGroup(groupId);
			if (!isValid) {
				throw new Error("Validation failed");
			}
			const selectedGroup = get().groups.find((g) => g.id === groupId);
			if (!selectedGroup) {
				throw new Error("Group doesnt exists");
			}
			console.log("Saving schema", selectedGroup);
			const result = await smartSearchCreateSchema(selectedGroup);
			get().deleteGroup(groupId);
			set({ saving: false }); // no need to check if in saving state as it is already been checked in the component side
			return result;
		},
	}));

// Store for managing existing schemas (add fields, edit fields, delete fields, delete groups)
interface SmartSearchSchemaManageStoreState {
	// Loading states
	isAddingField: boolean;
	isDeletingGroup: boolean;
	isEditingField: boolean;
	isDeletingField: boolean;

	// Actions
	addFieldsToGroup: (
		groupId: string,
		fields: SmartSearchFieldInputNoId[],
	) => Promise<string>;
	deleteGroup: (groupId: string) => Promise<string>;
	editField: (
		fieldId: string,
		updates: Partial<Pick<SmartSearchFieldInput, "name" | "description" | "type">>,
	) => Promise<string>;
	deleteField: (fieldId: string) => Promise<string>;
}

export const smartSearchSchemaManageStore =
	create<SmartSearchSchemaManageStoreState>((set) => ({
		isAddingField: false,
		isDeletingGroup: false,
		isEditingField: false,
		isDeletingField: false,

		addFieldsToGroup: async (groupId: string, fields) => {
			set({ isAddingField: true });
			try {
				const result = await addFieldToGroupSchema(groupId, fields);
				return result.message;
			} finally {
				set({ isAddingField: false });
			}
		},

		deleteGroup: async (groupId: string) => {
			set({ isDeletingGroup: true });
			try {
				const result = await deleteGroupSchema(groupId);
				return result.message;
			} finally {
				set({ isDeletingGroup: false });
			}
		},

		editField: async (fieldId: string, updates) => {
			set({ isEditingField: true });
			try {
				const result = await editFieldSchema(fieldId, updates);
				return "Field updated successfully";
			} finally {
				set({ isEditingField: false });
			}
		},

		deleteField: async (fieldId: string) => {
			set({ isDeletingField: true });
			try {
				const result = await deleteFieldSchema(fieldId);
				return result.message;
			} finally {
				set({ isDeletingField: false });
			}
		},
	}));

import { nanoid } from "nanoid";
import { create } from "zustand";
import { fetchSmartSearchSchema, smartSearch } from "../api/smartsearch";
import {
	type SearchEngineHits,
	type SmartSearchFieldInput,
	type SmartSearchGroupInput,
	type SmartSearchGroupSchema,
	type FieldType,
	FieldTypeValue,
} from "../type/smartsearch";

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

interface SmartSearchSchemaCreateStoreState {
	groups: SmartSearchGroupInput[];
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
	saveSchema: (groups: SmartSearchGroupInput[]) => Promise<void>;
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

export const smartSearchSchemaCreateStore =
	create<SmartSearchSchemaCreateStoreState>((set) => ({
		groups: [],
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
			set((state) => ({
				groups: state.groups.filter((group) => group.id !== groupId),
			}));
		},
		updateGroup: (
			groupId: string,
			updates: Partial<Pick<SmartSearchGroupInput, "description" | "name">>,
		) => {
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
			set((state) => ({
				groups: state.groups.map((group) =>
					group.id === groupId
						? {
								...group,
								fields: group.fields.filter((field) => field.id !== fieldId),
							}
						: group,
				),
			}));
		},
		updateField: (
			groupId: string,
			fieldId: string,
			updates: Partial<
				Pick<SmartSearchFieldInput, "description" | "name" | "type">
			>,
		) => {
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
		saveSchema: async (groups: SmartSearchGroupInput[]) => {},
	}));

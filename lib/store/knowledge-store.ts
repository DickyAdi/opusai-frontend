import { create } from "zustand";
import { KnowledgeStore } from "../type/knowledge";
import { deleteKnowledge, retrieveKnowledge } from "../api/rag";

const initialState = {
	knowledges: [],
	pagination: null,
	isLoading: false,
	isLoadingNext: false,
	isLoadingPrevious: false,
	error: null,
	cursorStack: [],
	currentCursor: null,
	pageSize: 10,
};

export const knowledgeStore = create<KnowledgeStore>((set, get) => ({
	...initialState,

	fetchKnowledges: async (
		cursor: string | null = null,
		append: boolean = false,
	) => {
		const { pageSize } = get();

		set({
			isLoading: true,
			error: null,
		});

		try {
			const response = await retrieveKnowledge(pageSize, cursor);

			set((state) => ({
				knowledges: append
					? [...state.knowledges, ...response.data]
					: response.data,
				pagination: response.pagination,
				currentCursor: cursor,
				isLoading: false,
				isLoadingNext: false,
				isLoadingPrevious: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
				isLoading: false,
				isLoadingNext: false,
				isLoadingPrevious: false,
			});
			throw error;
		}
	},

	deleteKnowledges: async (file: string, index: string = "dummy_index") => {
		set({
			isLoading: true,
		});

		try {
			const response = await deleteKnowledge(file, index);
			set({
				isLoading: false,
				isLoadingNext: false,
				isLoadingPrevious: false,
			});
			return response;
		} catch (err) {
			set({
				isLoading: false,
				isLoadingNext: false,
				isLoadingPrevious: false,
			});
			throw err instanceof Error
				? err
				: new Error("Failed to delete knowledge");
		}
	},

	removeKnowledges: (storedName: string) => {
		set((state) => ({
			knowledges: state.knowledges.filter(
				(row) => row.stored_name !== storedName,
			),
		}));
	},

	refresh: async () => {
		const { currentCursor } = get();
		await get().fetchKnowledges(currentCursor, false);
	},

	fetchNext: async () => {
		const { pagination, currentCursor, cursorStack, isLoadingNext } = get();

		if (!pagination?.next_cursor || isLoadingNext) return;

		set({ isLoadingNext: true });

		try {
			const newStack = [...cursorStack, currentCursor];
			await get().fetchKnowledges(pagination.next_cursor, true);
			set({ cursorStack: newStack });
		} catch (error) {
			set({ isLoadingNext: false });
			throw error;
		}
	},

	fetchPrevious: async () => {
		const { cursorStack, isLoadingPrevious, pageSize } = get();

		if (cursorStack.length === 0 || isLoadingPrevious) return;

		set({ isLoadingPrevious: true });

		try {
			const previousCursor = cursorStack[cursorStack.length - 1];
			const newStack = cursorStack.slice(0, -1);

			const response = await retrieveKnowledge(pageSize, previousCursor);

			set({
				knowledges: response.data,
				pagination: response.pagination,
				currentCursor: previousCursor,
				cursorStack: newStack,
				isLoadingPrevious: false,
			});
		} catch (error) {
			set({ isLoadingPrevious: false });
			throw error;
		}
	},

	goToFirst: async () => {
		set({
			cursorStack: [],
			currentCursor: null,
			knowledges: [],
			pagination: null,
		});
		await get().fetchKnowledges(null, false);
	},

	setPageSize: (size: number) => {
		console.log("Am i running?");
		set({
			pageSize: size,
			cursorStack: [],
			currentCursor: null,
			knowledges: [],
			pagination: null,
		});
		get().fetchKnowledges(null, false);
	},

	reset: () => {
		set(initialState);
	},

	clearError: () => set({ error: null }),
}));

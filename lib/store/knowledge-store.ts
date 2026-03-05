import { create } from "zustand";
import { KnowledgeItem, KnowledgeStore } from "../type/knowledge";
import {
	deleteKnowledge,
	retrieveKnowledge,
	searchKnowledgeAPI,
} from "../api/rag";

// const initialState = {
// 	knowledges: [],
// 	pagination: null,
// 	isLoading: false,
// 	isLoadingNext: false,
// 	isLoadingPrevious: false,
// 	error: null,
// 	cursorStack: [],
// 	currentCursor: null,
// 	pageSize: 10,
//   paginationMode: 'cursor',
//   currentPage: 1,
//   totalPages: 1,
// };

// export const knowledgeStore = create<KnowledgeStore>((set, get) => ({
// 	...initialState,

// 	fetchKnowledges: async (
// 		cursor: string | null = null,
// 		append: boolean = false,
// 	) => {
// 		const { pageSize } = get();

// 		set({
// 			isLoading: true,
// 			error: null,
// 		});

// 		try {
// 			const response = await retrieveKnowledge(pageSize, cursor);

// 			set((state) => ({
// 				knowledges: append
// 					? [...state.knowledges, ...response.data]
// 					: response.data,
// 				pagination: response.pagination,
// 				currentCursor: cursor,
// 				isLoading: false,
// 				isLoadingNext: false,
// 				isLoadingPrevious: false,
// 			}));
// 		} catch (error) {
// 			set({
// 				error:
// 					error instanceof Error ? error.message : "Unknown error occurred",
// 				isLoading: false,
// 				isLoadingNext: false,
// 				isLoadingPrevious: false,
// 			});
// 			throw error;
// 		}
// 	},

// 	deleteKnowledges: async (file: string, index: string = "dummy_index") => {
// 		set({
// 			isLoading: true,
// 		});

// 		try {
// 			const response = await deleteKnowledge(file, index);
// 			set({
// 				isLoading: false,
// 				isLoadingNext: false,
// 				isLoadingPrevious: false,
// 			});
// 			return response;
// 		} catch (err) {
// 			set({
// 				isLoading: false,
// 				isLoadingNext: false,
// 				isLoadingPrevious: false,
// 			});
// 			throw err instanceof Error
// 				? err
// 				: new Error("Failed to delete knowledge");
// 		}
// 	},

// 	removeKnowledges: (storedName: string) => {
// 		set((state) => ({
// 			knowledges: state.knowledges.filter(
// 				(row) => row.stored_name !== storedName,
// 			),
// 		}));
// 	},

// 	refresh: async () => {
// 		const { currentCursor } = get();
// 		await get().fetchKnowledges(currentCursor, false);
// 	},

// 	fetchNext: async () => {
// 		const { pagination, currentCursor, cursorStack, isLoadingNext } = get();

// 		if (!pagination?.next_cursor || isLoadingNext) return;

// 		set({ isLoadingNext: true });

// 		try {
// 			const newStack = [...cursorStack, currentCursor];
// 			await get().fetchKnowledges(pagination.next_cursor, true);
// 			set({ cursorStack: newStack });
// 		} catch (error) {
// 			set({ isLoadingNext: false });
// 			throw error;
// 		}
// 	},

// 	fetchPrevious: async () => {
// 		const { cursorStack, isLoadingPrevious, pageSize } = get();

// 		if (cursorStack.length === 0 || isLoadingPrevious) return;

// 		set({ isLoadingPrevious: true });

// 		try {
// 			const previousCursor = cursorStack[cursorStack.length - 1];
// 			const newStack = cursorStack.slice(0, -1);

// 			const response = await retrieveKnowledge(pageSize, previousCursor);

// 			set({
// 				knowledges: response.data,
// 				pagination: response.pagination,
// 				currentCursor: previousCursor,
// 				cursorStack: newStack,
// 				isLoadingPrevious: false,
// 			});
// 		} catch (error) {
// 			set({ isLoadingPrevious: false });
// 			throw error;
// 		}
// 	},

// 	goToFirst: async () => {
// 		set({
// 			cursorStack: [],
// 			currentCursor: null,
// 			knowledges: [],
// 			pagination: null,
// 		});
// 		await get().fetchKnowledges(null, false);
// 	},

// 	setPageSize: (size: number) => {
// 		console.log("Am i running?");
// 		set({
// 			pageSize: size,
// 			cursorStack: [],
// 			currentCursor: null,
// 			knowledges: [],
// 			pagination: null,
// 		});
// 		get().fetchKnowledges(null, false);
// 	},

// 	reset: () => {
// 		set(initialState);
// 	},

// 	clearError: () => set({ error: null }),
// }));
const initialState = {
	knowledges: [] as KnowledgeItem[],
	pagination: null,
	isLoading: false,
	isLoadingNext: false,
	isLoadingPrevious: false,
	isSearching: false,
	error: null,
	cursorStack: [] as (string | null)[],
	currentCursor: null as string | null,
	pageSize: 10,
	searchQuery: "",
	// Hybrid pagination state
	paginationMode: "cursor" as "cursor" | "page",
	currentPage: 1,
	totalPages: 1,
	// Cache for page mode to support prev/next without refetching
	pagesCache: new Map<number, KnowledgeItem[]>(),
};

export const knowledgeStore = create<KnowledgeStore>((set, get) => ({
	...initialState,

	// Unified fetch that handles both cursor and page modes
	fetchKnowledges: async (
		params: { cursor?: string | null; page?: number; append?: boolean } = {},
	) => {
		const { pageSize, searchQuery, paginationMode } = get();
		const isSearchMode = !!searchQuery;

		set({
			isLoading: true,
			error: null,
		});

		try {
			if (isSearchMode) {
				// Page-based search mode
				const targetPage = params.page || 1;
				const response = await searchKnowledgeAPI({
					q: searchQuery,
					page: targetPage,
					limit: pageSize,
				});

				set((state) => ({
					knowledges: params.append
						? [...state.knowledges, ...response.data]
						: response.data,
					paginationMode: "page",
					currentPage: response.pagination.page,
					totalPages: response.pagination.total_pages,
					// Create a pagination-like object for compatibility
					pagination: {
						limit: pageSize,
						has_next: response.pagination.has_next,
						next_cursor: null,
					},
					isLoading: false,
					isLoadingNext: false,
					isLoadingPrevious: false,
					// Cache the page
					pagesCache: new Map(state.pagesCache).set(targetPage, response.data),
				}));
			} else {
				// Cursor-based normal mode
				const targetCursor = params.cursor ?? null;
				const response = await retrieveKnowledge(pageSize, targetCursor);

				set((state) => ({
					knowledges: params.append
						? [...state.knowledges, ...response.data]
						: response.data,
					paginationMode: "cursor",
					pagination: response.pagination,
					currentCursor: targetCursor,
					isLoading: false,
					isLoadingNext: false,
					isLoadingPrevious: false,
					// Reset page-related state
					currentPage: 1,
					totalPages: 1,
					pagesCache: new Map(),
					// Manage cursor stack for prev navigation
					cursorStack:
						params.cursor && !params.append
							? [...state.cursorStack, state.currentCursor]
							: params.cursor === null
								? []
								: state.cursorStack,
				}));
			}
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

	// Search switches to page mode
	searchKnowledges: async (query: string) => {
		if (!query.trim()) {
			// If empty query, clear search and go back to cursor mode
			await get().clearSearch();
			return;
		}

		set({
			searchQuery: query,
			isSearching: true,
			paginationMode: "page",
			currentPage: 1,
			totalPages: 1,
			pagesCache: new Map(),
			knowledges: [],
			cursorStack: [],
			currentCursor: null,
		});

		try {
			await get().fetchKnowledges({ page: 1 });
		} finally {
			set({ isSearching: false });
		}
	},

	// Clear search and return to cursor mode
	clearSearch: async () => {
		set({
			searchQuery: "",
			isSearching: false,
			paginationMode: "cursor",
			currentPage: 1,
			totalPages: 1,
			pagesCache: new Map(),
		});
		// Refetch initial cursor-based data
		await get().fetchKnowledges({ cursor: null, append: false });
	},

	// Mode-aware next
	fetchNext: async () => {
		const {
			paginationMode,
			pagination,
			currentPage,
			pagesCache,
			isLoadingNext,
		} = get();

		if (isLoadingNext) return;

		set({ isLoadingNext: true });

		try {
			if (paginationMode === "page") {
				// Page-based: check if we have next
				if (currentPage >= get().totalPages) {
					set({ isLoadingNext: false });
					return;
				}

				const nextPage = currentPage + 1;

				// Check cache first for instant navigation
				if (pagesCache.has(nextPage)) {
					set((state) => ({
						knowledges: pagesCache.get(nextPage)!,
						currentPage: nextPage,
						pagination: {
							limit: state.pageSize, // Use pageSize instead
							has_next: nextPage < state.totalPages,
							next_cursor: null,
						},
						isLoadingNext: false,
					}));
				} else {
					// Fetch from server
					await get().fetchKnowledges({ page: nextPage });
				}
			} else {
				// Cursor-based
				if (!pagination?.next_cursor) {
					set({ isLoadingNext: false });
					return;
				}

				set((state) => ({
					cursorStack: [...state.cursorStack, state.currentCursor],
				}));
				await get().fetchKnowledges({
					cursor: pagination.next_cursor,
					append: true,
				});
			}
		} catch (error) {
			set({ isLoadingNext: false });
			throw error;
		}
	},

	// Mode-aware previous
	fetchPrevious: async () => {
		const {
			paginationMode,
			currentPage,
			cursorStack,
			pagesCache,
			isLoadingPrevious,
		} = get();

		if (isLoadingPrevious) return;

		set({ isLoadingPrevious: true });

		try {
			if (paginationMode === "page") {
				if (currentPage <= 1) {
					set({ isLoadingPrevious: false });
					return;
				}

				const prevPage = currentPage - 1;

				// Check cache first
				if (pagesCache.has(prevPage)) {
					set((state) => ({
						knowledges: pagesCache.get(prevPage)!,
						currentPage: prevPage,
						pagination: {
							limit: state.pageSize, // Use pageSize instead
							has_next: prevPage < state.totalPages,
							next_cursor: null, // We can always go next if we went back
						},
						isLoadingPrevious: false,
					}));
				} else {
					// Fetch from server
					await get().fetchKnowledges({ page: prevPage });
				}
			} else {
				// Cursor-based
				if (cursorStack.length === 0) {
					set({ isLoadingPrevious: false });
					return;
				}

				const previousCursor = cursorStack[cursorStack.length - 1];
				const newStack = cursorStack.slice(0, -1);

				const response = await retrieveKnowledge(
					get().pageSize,
					previousCursor,
				);

				set({
					knowledges: response.data,
					pagination: response.pagination,
					currentCursor: previousCursor,
					cursorStack: newStack,
					isLoadingPrevious: false,
				});
			}
		} catch (error) {
			set({ isLoadingPrevious: false });
			throw error;
		}
	},

	// Mode-aware refresh
	refresh: async () => {
		const { paginationMode, currentPage, currentCursor } = get();

		if (paginationMode === "page") {
			// Clear cache and refetch current page
			set((state) => ({ pagesCache: new Map() }));
			await get().fetchKnowledges({ page: currentPage });
		} else {
			await get().fetchKnowledges({ cursor: currentCursor, append: false });
		}
	},

	// Mode-aware go to first
	goToFirst: async () => {
		const { paginationMode } = get();

		if (paginationMode === "page") {
			set({
				currentPage: 1,
				knowledges: [],
			});
			await get().fetchKnowledges({ page: 1 });
		} else {
			set({
				cursorStack: [],
				currentCursor: null,
				knowledges: [],
				pagination: null,
			});
			await get().fetchKnowledges({ cursor: null, append: false });
		}
	},

	// Mode-aware set page size
	setPageSize: (size: number) => {
		const { paginationMode } = get();

		set({
			pageSize: size,
			pagesCache: new Map(), // Clear cache on size change
		});

		if (paginationMode === "page") {
			set({
				currentPage: 1,
				knowledges: [],
			});
			get().fetchKnowledges({ page: 1 });
		} else {
			set({
				cursorStack: [],
				currentCursor: null,
				knowledges: [],
				pagination: null,
			});
			get().fetchKnowledges({ cursor: null, append: false });
		}
	},

	deleteKnowledges: async (file: string, index: string = "dummy_index") => {
		set({ isLoading: true });

		try {
			const response = await deleteKnowledge(file, index);

			// Optimistic removal
			get().removeKnowledges(file);

			set({ isLoading: false });
			return response;
		} catch (err) {
			set({ isLoading: false });
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

	reset: () => {
		set(initialState);
	},

	clearError: () => set({ error: null }),
}));

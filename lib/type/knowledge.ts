const KnowledgeTypeEnum = {
	rule: "rule",
	document: "document",
	archive: "archive",
} as const;

export type Knowledge = {
	name: string;
	type: (typeof KnowledgeTypeEnum)[keyof typeof KnowledgeTypeEnum];
};

export const dummyKnowledge: Knowledge[] = [
	{
		name: "Getting Started Guide",
		type: "document",
	},
	{
		name: "API Reference Documentation",
		type: "document",
	},
	{
		name: "User Authentication Best Practices",
		type: "rule",
	},
	{
		name: "Database Schema Overview",
		type: "document",
	},
	{
		name: "Deployment Guide for Production",
		type: "document",
	},
	{
		name: "Code Style Guidelines",
		type: "rule",
	},
	{
		name: "TypeScript Configuration Tutorial",
		type: "document",
	},
	{
		name: "Security Policy Requirements",
		type: "rule",
	},
	{
		name: "Performance Optimization Techniques",
		type: "document",
	},
	{
		name: "Testing Strategy Documentation",
		type: "document",
	},
	{
		name: "Q3 2024 Project Archive",
		type: "archive",
	},
	{
		name: "Error Handling Standards",
		type: "rule",
	},
	{
		name: "Code Review Checklist",
		type: "rule",
	},
	{
		name: "Mobile Responsive Design Guide",
		type: "document",
	},
	{
		name: "Accessibility Compliance Rules",
		type: "rule",
	},
	{
		name: "Legacy System Documentation",
		type: "archive",
	},
	{
		name: "Microservices Architecture Overview",
		type: "document",
	},
	{
		name: "GraphQL Query Examples",
		type: "document",
	},
	{
		name: "2023 Annual Reports",
		type: "archive",
	},
	{
		name: "Monitoring and Logging Setup",
		type: "document",
	},
];

export type knowledgeType = {
	name: string;
	stored_name: string;
	last_modified: string;
};

export interface KnowledgeItem {
	name: string;
	stored_name: string;
	last_modified: string;
}

export type PageBasePaginationFormat = {
	limit: number;
	page: number;
	total: number;
	total_pages: number;
	has_next: boolean;
	has_prev: boolean;
};

export type SearchKnowledgeResponse = {
	success: boolean;
	data: knowledgeType[];
	pagination: PageBasePaginationFormat;
};

export interface CursorPagination {
	limit: number;
	has_next: boolean;
	next_cursor: string | null;
}

export interface KnowledgeResponse {
	success: boolean;
	data: KnowledgeItem[];
	pagination: CursorPagination;
}

// types/knowledgeStore.ts
// export interface KnowledgeState {
// 	// Data
// 	knowledges: KnowledgeItem[];
// 	pagination: CursorPagination | null;

// 	// Loading states
// 	isLoading: boolean;
// 	isLoadingNext: boolean;
// 	isLoadingPrevious: boolean;
// 	error: string | null;

// 	// Cursor history for navigation (stack)
// 	cursorStack: (string | null)[];
// 	currentCursor: string | null;

// 	// Settings
// 	pageSize: number;

// 	paginationMode: "cursor" | "page";
// 	currentPage: number;
// 	totalPages: number;
// }

export interface KnowledgeState {
	knowledges: KnowledgeItem[];
	pagination: CursorPagination | null;
	isLoading: boolean;
	isLoadingNext: boolean;
	isLoadingPrevious: boolean;
	isSearching: boolean;
	error: string | null;
	cursorStack: (string | null)[];
	currentCursor: string | null;
	pageSize: number;
	searchQuery: string;
	paginationMode: "cursor" | "page";
	currentPage: number;
	totalPages: number;
	pagesCache: Map<number, KnowledgeItem[]>;
}

// export interface KnowledgeActions {
// 	// Core fetching
// 	fetchKnowledges: (cursor?: string | null, append?: boolean) => Promise<void>;
// 	deleteKnowledges: (file: string, index: string) => Promise<string>;
// 	removeKnowledges: (file: string) => void;
// 	refresh: () => Promise<void>;

// 	// Navigation
// 	fetchNext: () => Promise<void>;
// 	fetchPrevious: () => Promise<void>;
// 	goToFirst: () => Promise<void>;

// 	// State management
// 	setPageSize: (size: number) => void;
// 	reset: () => void;
// 	clearError: () => void;
// }

export interface KnowledgeActions {
	fetchKnowledges: (params?: {
		cursor?: string | null;
		page?: number;
		append?: boolean;
	}) => Promise<void>;
	searchKnowledges: (query: string) => Promise<void>;
	clearSearch: () => Promise<void>;
	deleteKnowledges: (file: string, index?: string) => Promise<any>;
	removeKnowledges: (storedName: string) => void;
	refresh: () => Promise<void>;
	fetchNext: () => Promise<void>;
	fetchPrevious: () => Promise<void>;
	goToFirst: () => Promise<void>;
	setPageSize: (size: number) => void;
	reset: () => void;
	clearError: () => void;
}

export type KnowledgeStore = KnowledgeState & KnowledgeActions;

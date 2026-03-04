import { create } from "zustand";
import {
	insertKnowledge,
	retrieveKnowledge,
	retrieveKnowledgeResponseSchema,
} from "../api/rag";
import { knowledgeType } from "../type/knowledge";

interface insertionResponseSchema {
	message: string;
	success_count: number;
	failed_count: number;
}

interface knowledgeRetrievePaginationSchema
	extends Pick<retrieveKnowledgeResponseSchema, "pagination" | "success"> {}

interface RagStoreState {
	files: File[];
	// knowledges: knowledgeType[];
	isLoading: boolean;
	// isLoadingKnowledge: boolean;
	isLimitReached: boolean;
	appendFile: (file: File | File[]) => void;
	removeFile: (index: number) => void;
	resetFiles: () => void;
	insertion: (
		use_gpu: boolean,
		smartsearch: boolean,
	) => Promise<insertionResponseSchema>;
	setLoading: (value: boolean) => void;
	// setIsLoadingKnowledge: (value: boolean) => void;
	setIsLimitReached: (e: boolean) => void;
	// loadKnowledge: (limit:number, cursor:string) => Promise<knowledgeRetrievePaginationSchema>;
}

export const ragStoreState = create<RagStoreState>((set, get) => ({
	files: [],
	// knowledges: [],
	isLoading: false,
	// isLoadingKnowledge: false,
	isLimitReached: false,
	appendFile: (files: File | File[]) => {
		if (Array.isArray(files)) {
			set((state) => ({ files: [...state.files, ...files] }));
		} else {
			set((state) => ({ files: [...state.files, files] }));
		}
	},
	removeFile: (index: number) =>
		set((state) => ({
			files: state.files.filter((_, i) => i !== index),
		})),
	resetFiles: () => set({ files: [] }),
	insertion: async (
		use_gpu: boolean = false,
		smart_search: boolean = false,
	) => {
		set({ isLoading: true });
		const uploadedFiles = get().files;
		try {
			const response = await insertKnowledge(
				uploadedFiles,
				use_gpu,
				smart_search,
			);
			return response;
		} catch (err) {
			console.error(err);
			throw err instanceof Error
				? err
				: new Error("Failed to insert knowledge");
		} finally {
			try {
				set({ isLoading: false });
			} catch (cleanUp) {
				console.error("Failed to reset loading state", cleanUp);
			}
		}
	},
	setLoading: (value: boolean) => set({ isLoading: value }),
	// setIsLoadingKnowledge: (value: boolean) => set({ isLoadingKnowledge: value }),
	setIsLimitReached: (e: boolean) => set({ isLimitReached: e }),
	// loadKnowledge: async (limit:number, cursor:string) => {
	// 	set({isLoadingKnowledge:true})
	// 	try {
	// 		const response = await retrieveKnowledge(limit, cursor)
	// 		set({knowledges: response.data})
	// 		return {...response}
	// 	} catch(err) {
	// 		console.error("Error when retrieving knowledge")
	// 		throw err
	// 	} finally {
	// 		set({isLoadingKnowledge:false})
	// 	}
	// }
}));

import { fetchChunk, fetchPdf } from "@/lib/api/rag";
import {
	ALLOWED_MIME_CHAT_UPLOAD_FILE,
	MAX_FILES,
	MAX_INSERTION_FILE_SIZE,
} from "@/lib/config/constants";
import { ragStoreState } from "@/lib/store/rag_store";
import React, { useCallback, useRef } from "react";
import { useAppendError } from "./useError";
import { useAppendSuccess } from "./useSuccess";
import { Files } from "lucide-react";
import { knowledgeStore } from "@/lib/store/knowledge-store";

export function useFetchChunk() {
	const getChunk = useCallback(async (chunkId: string) => {
		return await fetchChunk(chunkId);
	}, []);
	return { getChunk };
}

export function useFetchPdf() {
	const getPdf = useCallback(async (filename: string) => {
		return await fetchPdf(filename);
	}, []);
	return { getPdf };
}

export function useGetInsertionFiles() {
	return ragStoreState((state) => state.files);
}

export function useIsInsertionLoading() {
	return ragStoreState((state) => state.isLoading);
}

export function useAppendInsertionFile() {
	return ragStoreState((state) => state.appendFile);
}

export function useRemoveInsertionFile() {
	return ragStoreState((state) => state.removeFile);
}

export function useResetInsertionFiles() {
	return ragStoreState((state) => state.resetFiles);
}

export function useInsertion() {
	return ragStoreState((state) => state.insertion);
}

export function useSetInsertionIsLoading() {
	return ragStoreState((state) => state.setLoading);
}

export function useInsertionIsLimit() {
	return ragStoreState((state) => state.isLimitReached);
}

export function useInsertionSetIsLimit() {
	return ragStoreState((state) => state.setIsLimitReached);
}

export function useHandleFileInsertionSelect() {
	const appendError = useAppendError();
	const files = useGetInsertionFiles();
	const appendFile = useAppendInsertionFile();

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFiles = event.target.files;
			if (!selectedFiles || selectedFiles.length === 0) return;
			// Filter out oversized files first
			const validFiles = Array.from(selectedFiles).filter((file) => {
				if (file.size > MAX_INSERTION_FILE_SIZE) {
					appendError(
						`${file.name} exceeds ${(MAX_INSERTION_FILE_SIZE / 1024 / 1024).toFixed(0)}MB limit and was skipped`,
					);
					return false;
				} else if (!ALLOWED_MIME_CHAT_UPLOAD_FILE.includes(file.type)) {
					appendError(`${file.name} type is not supported`);
					return false;
				}
				return true;
			});

			if (validFiles.length === 0) {
				if (event.target) event.target.value = "";
				return;
			}

			// Check count limit with valid files only
			if (files.length + validFiles.length > MAX_FILES) {
				appendError(
					`You can only upload up to ${MAX_FILES} files. Please remove some files first.`,
				);
				if (event.target) event.target.value = "";
				return;
			}

			appendFile(validFiles); // Use the filtered array

			if (event.target) event.target.value = "";
		},
		[appendFile, files.length, appendError],
	);
	return handleFileSelect;
}

export function useHandleFileInsertionDrop() {
	const appendError = useAppendError();
	const files = useGetInsertionFiles();
	// const isLimitReached = files.length >= MAX_FILES;
	const isLimitReached = useInsertionIsLimit();
	const remainingSlots = MAX_FILES - files.length;
	const appendFile = useAppendInsertionFile();

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			if (isLimitReached) {
				appendError(
					`Maximum ${MAX_FILES} files allowed. Remove files to add more.`,
				);
				return;
			}

			const droppedFiles = event.dataTransfer.files;
			if (droppedFiles.length === 0) return;

			// Check limit
			if (files.length + droppedFiles.length > MAX_FILES) {
				appendError(
					`Cannot add ${droppedFiles.length} file(s). Only ${remainingSlots} slot(s) remaining.`,
				);
				return;
			}

			appendFile(Array.from(droppedFiles));
		},
		[appendFile, files.length, isLimitReached, remainingSlots, appendError],
	);
	return handleDrop;
}

export function useHandleFileInsertionRemove() {
	const removeFile = useRemoveInsertionFile();

	const removeFileHandler = useCallback(
		(index: number) => {
			removeFile(index);
		},
		[removeFile],
	);
	return removeFileHandler;
}

export function useHandleFileInsertionUpload() {
	const appendSuccess = useAppendSuccess();
	const resetFiles = useResetInsertionFiles();
	const appendError = useAppendError();
	const files = useGetInsertionFiles();
	const insertion = useInsertion();

	const handleUpload = useCallback(async () => {
		if (files.length === 0) return;

		try {
			const result = await insertion(false, false);
			appendSuccess(result.message);
			resetFiles();
		} catch (err) {
			console.error("Upload failed:", err);
			appendError(
				err instanceof Error ? err.message : "Failed to insert knowledge",
			);
		}
	}, [files, insertion, resetFiles, appendError, appendSuccess]);

	return handleUpload;
}

export function useHandleFileInsertionLabelClick() {
	// const files = useGetInsertionFiles();
	// const isLimitReached = files.length >= MAX_FILES;
	const isLimitReached = useInsertionIsLimit();
	const appendError = useAppendError();

	const handleLabelClick = useCallback(
		(e: React.MouseEvent) => {
			if (isLimitReached) {
				e.preventDefault();
				appendError(
					`Maximum ${MAX_FILES} files reached. Remove files to upload more.`,
				);
			}
		},
		[appendError, isLimitReached],
	);

	return handleLabelClick;
}

export function useFetchKnowledges() {
	return knowledgeStore((state) => state.fetchKnowledges);
}

export function useKnowledgeRefresh() {
	return knowledgeStore((state) => state.refresh);
}

export function useFetchNextKnowledges() {
	return knowledgeStore((state) => state.fetchNext);
}

export function useDeleteKnowledges() {
	return knowledgeStore((state) => state.deleteKnowledges);
}

export function useRemoveKnowledges() {
	return knowledgeStore((state) => state.removeKnowledges);
}

export function useFetchPreviousKnowledges() {
	return knowledgeStore((state) => state.fetchPrevious);
}

export function useGoToFirstKnowledge() {
	return knowledgeStore((state) => state.goToFirst);
}

export function useSetKnowledgePageSize() {
	return knowledgeStore((state) => state.setPageSize);
}

export function useResetKnowledgeStore() {
	return knowledgeStore((state) => state.reset);
}

export function useClearKnowledgeError() {
	return knowledgeStore((state) => state.clearError);
}

// ───────────────────────────────────────────────────────────
// STATE SELECTORS (Granular picks to prevent unnecessary re-renders)
// ───────────────────────────────────────────────────────────

export function useKnowledges() {
	return knowledgeStore((state) => state.knowledges);
}

export function useKnowledgePagination() {
	return knowledgeStore((state) => state.pagination);
}

export function useKnowledgeLoading() {
	return knowledgeStore((state) => state.isLoading);
}

export function useKnowledgeLoadingNext() {
	return knowledgeStore((state) => state.isLoadingNext);
}

export function useKnowledgeLoadingPrevious() {
	return knowledgeStore((state) => state.isLoadingPrevious);
}

export function useKnowledgeError() {
	return knowledgeStore((state) => state.error);
}

export function useKnowledgeCursorStack() {
	return knowledgeStore((state) => state.cursorStack);
}

export function useKnowledgeCurrentCursor() {
	return knowledgeStore((state) => state.currentCursor);
}

export function useKnowledgePageSize() {
	return knowledgeStore((state) => state.pageSize);
}

// ───────────────────────────────────────────────────────────
// DERIVED/COMPUTED SELECTORS (For common combinations)
// ───────────────────────────────────────────────────────────

export function useKnowledgeHasNext() {
	return knowledgeStore((state) => state.pagination?.has_next ?? false);
}

export function useKnowledgeHasPrevious() {
	return knowledgeStore((state) => state.cursorStack.length > 0);
}

export function useKnowledgePaginationMode() {
	return knowledgeStore((state) => state.paginationMode);
}

export function useKnowledgeCurrentPage() {
	return knowledgeStore((state) => state.currentPage);
}

export function useKnowledgeTotalPages() {
	return knowledgeStore((state) => state.totalPages);
}

export function useKnowledgeSearchQuery() {
	return knowledgeStore((state) => state.searchQuery);
}

export function useKnowledgeIsSearching() {
	return knowledgeStore((state) => state.isSearching);
}

export function useSearchKnowledges() {
	return knowledgeStore((state) => state.searchKnowledges);
}

export function useClearSearch() {
	return knowledgeStore((state) => state.clearSearch);
}

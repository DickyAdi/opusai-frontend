import { fetchChunk, fetchPdf } from "@/lib/api/rag";
import { useCallback } from "react";

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

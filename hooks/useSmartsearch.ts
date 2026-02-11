import { fetchSmartSearchSchema } from "@/lib/api/smartsearch";
import type { FetchSmartSearchSchemaResponse } from "@/lib/type/smartsearch";
import { useEffect, useState } from "react";
import { useAppendError } from "./useError";
import {
	smartSearchSchemaStore,
	smartSearchStore,
} from "@/lib/store/smartsearch_store";

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

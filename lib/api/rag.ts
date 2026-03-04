// import { BASE_URL } from "../config/constants";

import { KnowledgeResponse, knowledgeType } from "../type/knowledge";

interface ChunkResponseSchema {
	id: string;
	content: string;
	doc_id: string;
	file_name: string;
	file_path: string;
	created_at: string;
}

export interface retrieveKnowledgeResponseSchema {
	success: boolean;
	data: knowledgeType[];
	pagination: {
		limit: number;
		has_next: boolean;
		next_cursor: string;
	};
}

export function fetchChunk(chunkId: string) {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vectors/parents/${chunkId}`;
	return fetch(url, {
		method: "GET",
	})
		.then((resp) => {
			if (!resp.ok) {
				throw new Error(`FAILED TO FETCH REFERENCE`);
			}
			return resp.json();
		})
		.then((data: ChunkResponseSchema) => {
			return data;
		})
		.catch((error) => {
			console.error(`Error fetching chunk with id ${chunkId}: ${error}`);
			throw error;
		});
}

// this should support any kind of files tho but named fetchPdf because mainly will be used as Pdf fetcher
export async function fetchPdf(filename: string) {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents/files/${filename}`;

	const response = await fetch(url, { method: "GET" });

	if (!response.ok) {
		throw new Error(`An error occured - ${response.status}`);
	}

	const buffer = await response.arrayBuffer();

	const blob = new Blob([buffer], {
		type: response.headers.get("content-type") || "application/pdf",
	});

	return blob;
}

export async function insertKnowledge(
	files: File[],
	use_gpu: boolean = false,
	smartsearch: boolean = false,
) {
	const params = new URLSearchParams({
		use_gpu: String(use_gpu),
		smart_search: String(smartsearch),
	});
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents/insertion?${params}`;
	const formData = new FormData();

	if (!files || files.length === 0) {
		throw new Error("Files could not be empty");
	}

	files.forEach((file) => {
		formData.append("files", file);
	});

	try {
		const response = await fetch(url, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const err = await response.json();
			const errMsg = err.detail?.message || "Files failed to be uploaded";
			throw new Error(errMsg);
		}
		const data = (await response.json()) as {
			message: string;
			success_count: number;
			failed_count: number;
		};
		return data;
	} catch (error) {
		console.error("Failed to upload files", error);
		throw error;
	}
}

export async function retrieveKnowledge(limit: number, cursor: string | null) {
	const params = new URLSearchParams();
	params.set("limit", String(limit));
	if (cursor) {
		params.set("cursor", String(cursor));
	}
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents/storage?${params}`;
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data: KnowledgeResponse = await response.json();

		if (!response.ok) {
			throw new Error(`Failed to retrieve knowledges: ${response.status}`);
		}

		if (!data.success) {
			throw new Error("API returned unsuccessful response");
		}

		// const data: retrieveKnowledgeResponseSchema = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to retrieve knowledges: ", error);
		throw error;
	}
}

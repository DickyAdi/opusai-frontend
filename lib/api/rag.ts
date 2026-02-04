// import { BASE_URL } from "../config/constants";

interface ChunkResponseSchema {
	id: string;
	content: string;
	doc_id: string;
	file_name: string;
	file_path: string;
	created_at: string;
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

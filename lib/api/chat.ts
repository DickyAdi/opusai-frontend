import type {
	ChatChunkData,
	ChatCompletionData,
	ChatErrorData,
	ChatStartData,
	ChatStatusData,
	ToolChoiceType,
} from "../type/chat_message";
import { BASE_URL } from "../config/constants";

export interface ChatResponseSchema {
	conversation_id: string;
	input_id: string;
	response: {
		response_id: string;
		content: string;
		stop_reason: string;
		usage: {
			prompt_tokens: number;
			completion_tokens: number;
			total_tokens: number;
		};
	};
}

export async function fetchChat({
	conversation_id,
	query,
	model,
	file = false,
	file_paths = [],
	VDB = false,
	system_prompt_id,
	temperature = 0.7,
	stream = true,
	tool_choice = "auto",
	db_connect = false,
	headers,
	onStart,
	onStatusChange,
	onChunk,
	onComplete,
	onError,
}: {
	conversation_id: string | null;
	query: string;
	model: string;
	file: boolean;
	file_paths: string[];
	VDB: boolean;
	system_prompt_id: string;
	temperature: number;
	stream: boolean;
	tool_choice: ToolChoiceType;
	db_connect: boolean;
	headers?: Record<string, string>;
	onStart?: (data: ChatStartData) => void;
	onStatusChange?: (status: ChatStatusData) => void;
	onChunk?: (chunk: string) => void;
	onComplete?: (data: ChatCompletionData) => void;
	onError?: (error: string) => void;
}): Promise<ChatCompletionData | ChatResponseSchema | null> {
	const url = BASE_URL + "api/chat";
	const body = {
		conversation_id,
		query,
		model,
		file,
		file_paths,
		VDB,
		system_prompt_id,
		temperature,
		stream,
		tool_choice,
		db_connect,
	};
	const formated_headers = { "Content-Type": "application/json", ...headers };
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: formated_headers,
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`API Error ${response.status} - ${text}`);
		}

		if (stream && response.body) {
			console.log("stream initiated");
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			let resultComplete: ChatCompletionData | null = null;

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });

				const events = buffer.split("\n\n");
				buffer = events.pop() || "";

				for (const event of events) {
					if (!event.trim()) continue;

					const lines = event.split("\n");
					let eventData = "";
					let eventType = "";
					for (const line of lines) {
						if (line.startsWith("event: ")) {
							eventType = line.slice(7).trim();
						} else if (line.startsWith("data: ")) {
							eventData = line.slice(6);
						}
					}

					try {
						switch (eventType) {
							case "chat.start":
								{
									const startData = JSON.parse(eventData) as ChatStartData;
									if (startData && onStart) {
										onStart(startData);
									}
								}
								break;

							case "chat.status":
								{
									const statusData = JSON.parse(eventData) as ChatStatusData;
									if (statusData && onStatusChange) {
										onStatusChange(statusData);
									}
								}
								break;
							case "chat.chunk":
								{
									const chunkData = JSON.parse(eventData) as ChatChunkData;
									if (chunkData.content && onChunk) {
										onChunk(chunkData.content);
									}
								}
								break;

							case "chat.completion":
								{
									const completionData = JSON.parse(
										eventData,
									) as ChatCompletionData;
									// console.log(
									// 	"Printing if the completion chunk, checking if reference exists",
									// 	completionData,
									// );
									resultComplete = completionData;
									if (onComplete) {
										onComplete(completionData);
									}
								}
								break;

							case "chat.error":
								{
									const errorData = JSON.parse(eventData) as ChatErrorData;
									if (onError) {
										onError(
											`Streaming error: ${errorData.code} - ${errorData.message}`,
										);
									} else {
										throw new Error("Unhandled error. Throwing");
									}
								}
								break;

							default:
								throw new Error(`Unhandled event type ${eventType}`);
						}
					} catch (err) {
						console.error("Failed to parse SSE event: ", err);
					}
				}
			}
			return resultComplete;
		} else {
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				return (await response.json()) as ChatResponseSchema;
			} else {
				const text = await response.text();
				throw new Error(`Unexpected response format: ${text}`);
			}
		}
	} catch (err) {
		// const errMsg = err instanceof Error ? err.message : "Failed to sends a message"
		// console.error(errMsg)
		if (err instanceof Error) {
			console.error("Fetch error, ", {
				message: err.message,
				name: err.name,
				stack: err.stack,
			});
		} else {
			console.error("Unknown error ", err);
		}
		throw err;
	}
}

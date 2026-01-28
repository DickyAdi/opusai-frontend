import * as React from "react";
import ChatMessageType, {
	ChatCompletionData,
	ChatStartData,
	ChatStatusData,
} from "@/lib/type/chat_message";
import { messageStore } from "@/lib/store/message_store";
import {
	useConversationId,
	useCreateConversation,
	useFetchConversations,
	useSwitchConversation,
} from "./useConversation";
import { fetchChat } from "@/lib/api/chat";
import { useAppendError } from "./useError";
import { useRouter } from "next/navigation";

interface useChatHook {
	messages: ChatMessageType[];
	shouldResponse: boolean;
	// sendMessage: (message:string) => string | null;
	// sendMessage: (message:string) => Promise<string | null>;
	sendMessage: (message: string) => Promise<void>;
	getMessageForConv: ChatMessageType[];
	setShouldResponse: (e: boolean) => void;
}

export default function useChat(): useChatHook {
	const messages = useMessages();
	const shouldResponse = useShouldResponse();
	const setShouldResponse = useSetShouldResponse();
	const getMessageForConv = useGetMessageForConv();
	const sendMessage = useSendMessage();

	return {
		messages,
		shouldResponse,
		setShouldResponse,
		getMessageForConv,
		sendMessage,
	};
}

export function useUpdateMessageChunk() {
	return messageStore((state) => state.updateMessageChunk);
}

export function useCreateEmptyMessageForStream() {
	return messageStore((state) => state.createEmptyMessageForStream);
}

export function useAppendMessage() {
	return messageStore((state) => state.appendMessage);
}

export function useMessages() {
	return messageStore((state) => state.messages);
}

export function useShouldResponse() {
	return messageStore((state) => state.shouldResponse);
}

export function useSetShouldResponse() {
	return messageStore((state) => state.setShouldResponse);
}

export function useSetPrompt() {
	return messageStore((state) => state.setPrompt_id);
}

export function useGetPrompt() {
	return messageStore((state) => state.prompt_id);
}

export function useFetchModels() {
	// const availableModels = useAvailableModels();
	const loadModels = messageStore((state) => state.loadModels);
	// const hasLoaded = React.useRef(false)
	const [hasFetched, setHasFetched] = React.useState(false);
	const appendError = useAppendError();

	React.useEffect(() => {
		const getModels = async () => {
			// if (availableModels.length === 0 && !hasFetched) {
			if (!hasFetched) {
				// setHasFetched(true)
				try {
					await loadModels();
				} catch (error) {
					const errMsg =
						error instanceof Error
							? error.message
							: "Cannot load models from server, please contact us.";
					setHasFetched(false);
					appendError(errMsg);
				} finally {
					setHasFetched(true);
				}
			}
		};
		getModels();
	}, [loadModels, appendError, hasFetched]);
}

export function useClearMessages() {
	return messageStore((state) => state.clearMessages);
}

export function useConversationMessages() {
	const currentConversationId = useConversationId();
	const clearMessages = useClearMessages();
	const getConversationMessages = messageStore(
		(state) => state.getConversationMessages,
	);
	const isStreaming = useIsStreaming();
	const isProcessing = useIsProcessing();
	const prevConvIdRef = React.useRef<string | null>(null);

	React.useEffect(() => {
		const conversationChanged = prevConvIdRef.current !== currentConversationId;
		prevConvIdRef.current = currentConversationId;

		if (!conversationChanged) {
			return;
		}

		if (currentConversationId && !isStreaming && !isProcessing) {
			getConversationMessages(currentConversationId);
		} else if (currentConversationId === null) {
			clearMessages();
		}
	}, [
		currentConversationId,
		getConversationMessages,
		isStreaming,
		isProcessing,
		clearMessages,
	]);
}

// Integrated to backend
export function useGetMessageForConv() {
	return messageStore((state) => state.messages);
}

export function useAvailableModels() {
	return messageStore((state) => state.availableModels);
}

export function useSelectedModel() {
	return messageStore((state) => state.selectedModel);
}

export function useSetSelectedModel() {
	return messageStore((state) => state.setSelectedModel);
}

export function useIsLoadingModels() {
	return messageStore((state) => state.isLoadingModels);
}

export function useUpdateUserMessageId() {
	return messageStore((state) => state.updateUserMessageId);
}

export function useIsProcessing() {
	return messageStore((state) => state.isProcessing);
}

export function useClearFiles() {
	return messageStore((state) => state.clearFiles);
}

export function useThinkingStatus() {
	return messageStore((state) => state.thinkingStatus);
}

export function useSetIsThinkingStatus() {
	return messageStore((state) => state.setThinkingStatus);
}

export function useChatAPI() {
	const setIsThinking = useSetIsThinking();
	const selectedModel = useSelectedModel();
	const prompt_id = useGetPrompt();
	const files = useGetFiles();
	const parameter = useParameterSettings();
	const uploadFiles = useUploadFiles();
	const clearFiles = useClearFiles();
	const appendError = useAppendError();
	const setMessageScratchpad = useSetMessageScratchpad();
	const setThinkingStatus = useSetIsThinkingStatus();
	const setIsStreaming = useSetIsStreaming();
	const chunkQueueRef = React.useRef<string[]>([]);
	const processingRef = React.useRef(false);
	const processChunkQueue = React.useCallback(() => {
		if (processingRef.current || chunkQueueRef.current.length === 0) {
			return;
		}

		processingRef.current = true;

		const processNext = () => {
			if (chunkQueueRef.current.length === 0) {
				processingRef.current = false;
				return;
			}
			const chunk = chunkQueueRef.current.shift()!;
			setMessageScratchpad((prev) => prev + chunk);

			const queueSize = chunkQueueRef.current.length;

			if (queueSize > 10) {
				requestAnimationFrame(processNext);
			} else if (queueSize > 0) {
				setTimeout(processNext, 16);
			} else {
				setTimeout(processNext, 50);
			}

			// const chunk = chunkQueueRef.current.shift()!;
			// setMessageScratchpad((prev) => prev + chunk);

			// setTimeout(processNext, 30); // 30ms to stop react batch render (original solution)
			// requestAnimationFrame(processNext); //trying to fix stream starts after completion
		};

		processNext();
	}, [setMessageScratchpad]);

	const sendChatMessage = React.useCallback(
		async (
			conversation_id: string | null,
			message: string,
			onStart?: (data: ChatStartData) => void,
			onComplete?: (data: ChatCompletionData) => void,
		) => {
			try {
				let filesData = null;

				if (files && files.length > 0) {
					filesData = await uploadFiles(files);
					if (!filesData) {
						appendError("Failed to upload files");
						return;
					}
					console.log("Checking if files exists: ", files.length);
					clearFiles();
				}

				console.log("Logging the conversation id: ", conversation_id);
				chunkQueueRef.current = [];
				const params = {
					conversation_id: conversation_id,
					query: message,
					model: selectedModel,
					file: files.length > 0,
					file_paths: filesData
						? filesData.files.map((data) => data.file_path)
						: [],
					VDB: true,
					system_prompt_id: prompt_id,
					temperature: parameter.temperature,
					stream: true,
					tool_choice: "auto" as const,
					db_connect: false,
					onStart: (data: ChatStartData) => {
						setIsStreaming(true);
						// setIsThinking(false)
						if (onStart) {
							onStart(data);
						}
					},
					onStatusChange: (status: ChatStatusData) => {
						setThinkingStatus(status.status);
					},
					onChunk: (chunk: string) => {
						chunkQueueRef.current.push(chunk);
						processChunkQueue();
					},
					onComplete: (data: ChatCompletionData) => {
						const checkQueue = setInterval(() => {
							if (
								chunkQueueRef.current.length === 0 &&
								!processingRef.current
							) {
								clearInterval(checkQueue);
								setIsStreaming(false);
								setIsThinking(false);
								setThinkingStatus("");
								if (onComplete) {
									onComplete(data);
								}
							}
						}, 50);
					},
					onError: (error: string) => {
						setIsStreaming(false);
						setIsThinking(false);
						setThinkingStatus("");
						chunkQueueRef.current = [];
						processingRef.current = false;
						messageStore.getState().setMessageScratchpad("");

						appendError(error || "Stream error");
					},
				};
				setIsThinking(true);
				setIsStreaming(true);
				setMessageScratchpad("");
				const response = await fetchChat(params);
				return response;
			} catch (error) {
				const errMsg =
					error instanceof Error
						? error.message
						: "Failed to send chat request";
				setIsThinking(false);
				chunkQueueRef.current = [];
				processingRef.current = false;
				appendError(errMsg);
			} finally {
				setIsThinking(false);
			}
		},
		[
			selectedModel,
			prompt_id,
			files,
			parameter.temperature,
			setIsThinking,
			clearFiles,
			uploadFiles,
			appendError,
			setMessageScratchpad,
			setIsStreaming,
			processChunkQueue,
			setThinkingStatus,
		],
	);
	return { sendChatMessage };
}

export function useUploadFiles() {
	return messageStore((state) => state.uploadFiles);
}

export function useSendMessage() {
	const currentConversationId = useConversationId();
	const createConversation = useCreateConversation();
	const switchConversation = useSwitchConversation();
	const setShouldResponse = useSetShouldResponse();
	const appendMessage = useAppendMessage();
	const setMessageScratchpad = useSetMessageScratchpad();
	const messageScratchpad = useMessageScratchpad();
	const { sendChatMessage } = useChatAPI();
	const appendError = useAppendError();
	const updateUserMessageId = useUpdateUserMessageId();
	// const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))
	const isProcessing = messageStore((state) => state.isProcessing);
	const setIsProcessing = messageStore((state) => state.setIsProcessing);
	const router = useRouter();
	const setIsStreaming = useSetIsStreaming();

	const sendMessage = React.useCallback(
		async (message: string, stream: boolean = true) => {
			if (!message) {
				appendError("Cannot send a message with empty message.");
				return;
			}

			if (isProcessing) {
				console.log("Checking is processing: ", isProcessing);
				return;
			}

			setIsProcessing(true);
			let activeConvId = currentConversationId;

			try {
				const tempUserMsgId = crypto.randomUUID();
				appendMessage({
					conversationId: activeConvId || "temp",
					role: "user",
					message,
					id: tempUserMsgId,
				});

				const result = await sendChatMessage(
					activeConvId,
					message,
					async (data: ChatStartData) => {
						updateUserMessageId(tempUserMsgId, data.input_id);
						if (!activeConvId && data.conversation_id) {
							createConversation(data.title, data.conversation_id);
							switchConversation(data.conversation_id);
							router.replace(`/chat/${data.conversation_id}`);
							activeConvId = data.conversation_id;
						}
					},
					async (data: ChatCompletionData) => {
						await new Promise((resolve) => setTimeout(resolve, 100));
						const completeMessage = messageStore.getState().messageScratchpad;
						appendMessage({
							conversationId: data.conversation_id,
							role: "assistant",
							id: data.message_id,
							message: completeMessage,
							references: data.references,
						});
						messageStore.getState().setMessageScratchpad("");
					},
				);
				if (!result && !stream) {
					throw new Error("Failed to send chat");
				}
			} catch (error) {
				const errMsg =
					error instanceof Error
						? error.message
						: "Failed to send a message, please try again later";
				appendError(errMsg);
				setIsProcessing(false);
				setIsStreaming(false);
			} finally {
				setIsProcessing(false);
			}
		},
		[
			currentConversationId,
			createConversation,
			setIsStreaming,
			switchConversation,
			appendMessage,
			sendChatMessage,
			updateUserMessageId,
			isProcessing,
			setIsProcessing,
			router,
			appendError,
		],
	);
	return sendMessage;
}

export function useIsThinking() {
	return messageStore((state) => state.isThinking);
}

export function useSetIsThinking() {
	return messageStore((state) => state.setIsThinking);
}

export function useIsStreaming() {
	return messageStore((state) => state.isStreaming);
}

export function useSetIsStreaming() {
	return messageStore((state) => state.setIsStreaming);
}

export function useMessageScratchpad() {
	return messageStore((state) => state.messageScratchpad);
}

export function useSetMessageScratchpad() {
	return messageStore((state) => state.setMessageScratchpad);
}

export function useGetFiles() {
	return messageStore((state) => state.files);
}

export function useAppendFile() {
	return messageStore((state) => state.appendFile);
}

export function useRemoveFile() {
	return messageStore((state) => state.removeFile);
}

export function useParameterSettings() {
	return messageStore((state) => state.parameter);
}

export function useSetParameterSettings() {
	return messageStore((state) => state.setParameter);
}

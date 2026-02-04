import type { ChatMessageType } from "@/lib/type/chat_message";
import { ChatMessage } from "./chat_message";
import { memo, useEffect, useMemo, useRef } from "react";
import {
	useConversationMessages,
	useGetMessageForConv,
	useIsProcessing,
	useIsThinking,
	useMessageScratchpad,
} from "@/hooks/useChat";
import { ChatAIThinking } from "./loading";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useConversationId } from "@/hooks/useConversation";

const ChatListMessage = memo(function ChatListMessage() {
	const messages: ChatMessageType[] = useGetMessageForConv();
	const messageScratchpad = useMessageScratchpad();
	useConversationMessages();
	const isThinking = useIsThinking();
	const latestChat = useRef<HTMLDivElement>(null);
	const currentConversationId = useConversationId();
	const prevConvId = useRef<string | null>(currentConversationId);
	const renderedMessages = useMemo(() => {
		return messages.map((e) => (
			<ChatMessage
				key={e.id}
				id={e.id}
				sender={e.role}
				message={e.content}
				references={e.references}
			/>
		));
	}, [messages]);

	useEffect(() => {
		if (prevConvId.current !== currentConversationId) {
			prevConvId.current = currentConversationId;
			return;
		}

		latestChat.current?.scrollIntoView({ behavior: "smooth" });
	}, [currentConversationId]);

	return (
		<div className="flex flex-col gap-2 px-4">
			{renderedMessages}
			{(isThinking || messageScratchpad) && (
				<div className="flex flex-col justify-start">
					{isThinking ? (
						<ChatAIThinking />
					) : (
						<div className="chat-message p-3 max-w-[80%] rounded-xl wrap-break-word prose">
							<ReactMarkdown rehypePlugins={[rehypeHighlight]}>
								{messageScratchpad}
							</ReactMarkdown>
						</div>
					)}
				</div>
			)}
			<div ref={latestChat} />
		</div>
	);
});

export { ChatListMessage };

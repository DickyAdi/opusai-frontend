"use client";
import ChatInputArea from "@/components/chat/layout/chat_input_area";
import { ChatListMessage } from "@/components/chat/list_message";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	useConversationId,
	useSwitchConversation,
} from "@/hooks/useConversation";
import { useEffect } from "react";

export default function ChatUserPage() {
	const currentConversationId = useConversationId();
	const switchConversation = useSwitchConversation();

	useEffect(() => {
		switchConversation(currentConversationId);
	}, [currentConversationId, switchConversation]);
	return (
		<div className="relative flex flex-col h-screen">
			<ScrollArea className="flex-1 overflow-y-auto">
				<div className="mx-auto space-y-4 max-w-3xl pt-16 pb-48">
					<ChatListMessage />
				</div>
			</ScrollArea>
			<div className="absolute bottom-0 left-0 right-0">
				<ChatInputArea isRedirect={false} />
			</div>
		</div>
	);
}

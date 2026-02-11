"use client";
import ChatInputArea from "@/components/chat/layout/chat_input_area";
import { ChatListMessage } from "@/components/chat/list_message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "@/hooks/useChat";
import { useSwitchConversation } from "@/hooks/useConversation";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ChatUserPage() {
	const params = useParams();
	const pathConversationId = params.id as string;
	const switchConversation = useSwitchConversation();
	const messages = useMessages();
	const hasSwitched = useRef(false);
	console.log(`Existing conversation message store has ${messages.length}`);

	useEffect(() => {
		if (!hasSwitched.current && pathConversationId) {
			switchConversation(pathConversationId);
			hasSwitched.current = true;
		}
	}, [pathConversationId, switchConversation]);
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

"use client";

import ChatInputArea from "@/components/chat/layout/chat_input_area";
import { Spinner } from "@/components/ui/spinner";
import { useIsProcessing } from "@/hooks/useChat";
import { useSwitchConversation } from "@/hooks/useConversation";
import { useEffect } from "react";

export default function ChatPage() {
	const isProcessing = useIsProcessing();
	const switchConversation = useSwitchConversation();
	useEffect(() => {
		switchConversation(null);
	}, [switchConversation]);

	const welcomeMessage = (
		<div className="flex flex-col justify-center">
			<h1 className="text-4xl font-bold text-center">How's your day?</h1>
			<h2 className="text-base font-thin text-center">How can i help you?</h2>
		</div>
	);

	return (
		<div className="relative h-full">
			{/* <div className="flex items-center justify-center flex-1 pb-32"> */}
			<div className="absolute inset-0 flex items-center justify-center pb-32">
				<div>
					{isProcessing ? <Spinner className="size-12" /> : welcomeMessage}
				</div>
			</div>
			<div className="absolute bottom-0 left-0 right-0">
				<ChatInputArea isRedirect={true} />
			</div>
		</div>
	);
}

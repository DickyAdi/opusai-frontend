import { messageStore } from "@/lib/store/message_store";
import { conversationStore } from "@/lib/store/conversation_store";
import { useRouter } from "next/navigation";

export function useCreateNewConversation() {
	const switchConversation = conversationStore(
		(state) => state.switchConversation,
	);
	const clearMessages = messageStore((state) => state.clearMessages);
	const router = useRouter();

	return () => {
		console.log("am i called?");
		clearMessages();
		switchConversation(null);
		setTimeout(() => {
			router.push("/chat");
		}, 1);
	};
}

import * as React from "react";
import { conversationStore } from "@/lib/store/conversation_store";
import { ChatConversationType } from "@/lib/type/conversation";
import { useAppendError } from "./useError";

interface useConversationHook {
	conversations: ChatConversationType[];
	currentConversationId: string | null;
	createConversation: (title: string, convId?: string) => void;
	switchConversation: (id: string | null) => void;
}

export default function useConversation(
	dummy: string[] = [],
): useConversationHook {
	const {
		conversations,
		currentConversationId,
		createConversation,
		switchConversation,
	} = conversationStore();

	const memoizedDummy = React.useMemo(() => {
		return dummy;
	}, [dummy]);
	const init = React.useRef(false);

	React.useEffect(() => {
		if (
			!init.current &&
			conversations.length === 0 &&
			memoizedDummy.length > 0
		) {
			init.current = true;
			memoizedDummy.forEach((e) => {
				createConversation(e);
			});
		}
	}, [memoizedDummy, createConversation, conversations]); // to render dummy chat conversation

	return React.useMemo(
		() => ({
			conversations,
			currentConversationId,
			createConversation,
			switchConversation,
		}),
		[
			conversations,
			currentConversationId,
			createConversation,
			switchConversation,
		],
	);
}

export function useConversations() {
	return conversationStore((state) => state.conversations);
}

export function useConversationId() {
	return conversationStore((state) => state.currentConversationId);
}

export function useCreateConversation() {
	return conversationStore((state) => state.createConversation);
}

export function useInitializeConversations(default_value: string[] = []) {
	const conversations = useConversations();
	const createConversation = useCreateConversation();
	const memoizedDefaultValue = React.useMemo(() => {
		return default_value;
	}, [default_value]);

	const init = React.useRef(false);

	React.useEffect(() => {
		if (
			!init.current &&
			conversations.length === 0 &&
			memoizedDefaultValue.length > 0
		) {
			init.current = true;
			memoizedDefaultValue.forEach((e) => {
				createConversation(e);
			});
		}
	}, [conversations.length, memoizedDefaultValue, createConversation]);
}

export function useSwitchConversation() {
	return conversationStore((state) => state.switchConversation);
}

// export function useFetchConversations() {
//   const conversations = useConversations()
//   const loadConversation = conversationStore(state => state.loadConversation)
//   const hasLoaded = React.useRef(false)
//   const appendError = useAppendError()

//   React.useEffect(() => {
//     if (conversations.length === 0 && !hasLoaded.current) {
//       try {
//         hasLoaded.current = true
//         loadConversation()
//       } catch(error) {
//         appendError(error as string)
//       }
//     }
//   }, [loadConversation])
// }

export function useFetchConversations() {
	return conversationStore((state) => state.loadConversation);
}

export function useIsFullyLoaded() {
	return conversationStore((state) => state.isFullyLoaded);
}

export function useIsLoadingConv() {
	return conversationStore((state) => state.isLoadingConversations);
}

export function useUpdateConversationTitle() {
	return conversationStore((state) => state.updateConversationTitle);
}

export function useRemoveConversation() {
	return conversationStore((state) => state.removeConversation);
}

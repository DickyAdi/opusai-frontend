import * as React from "react"
import { conversationStore } from "@/lib/store/conversation_store";
import { ChatConversationType } from "@/lib/type/conversation";


interface useConversationHook {
  conversations: ChatConversationType[];
  currentConversationId: string | null
  createConversation: (title: string, convId?:string) => void;
  switchConversation: (id: string | null) => void;
}

export default function useConversation(dummy:string[] =[]):useConversationHook {
    const {
      conversations,
      currentConversationId,
      createConversation,
      switchConversation,
    } = conversationStore();


    const init = React.useRef(false)
    
    React.useEffect(() => {
      if (!init.current && conversations.length === 0 && dummy.length > 0) {
        init.current = true
        dummy.forEach((e) => createConversation(e))
      }
    }, []) // to render dummy chat conversation

    return React.useMemo(() => ({
      conversations,
      currentConversationId,
      createConversation,
      switchConversation
    }), [conversations, currentConversationId, createConversation, switchConversation])
}

export function useConversations() {
  return conversationStore(state => state.conversations)
}

export function useConversationId() {
  return conversationStore(state => state.currentConversationId)
}

export function useCreateConversation() {
  return conversationStore(state => state.createConversation)
}

export function useInitializeConversations(default_value:string[] = []) {
  const conversations = useConversations()
  const createConversation = useCreateConversation()

  const init = React.useRef(false)

  React.useEffect(() => {
    if (!init.current && conversations.length === 0 && default_value.length > 0 ) {
      init.current = true
      default_value.forEach((e) => createConversation(e))
    }
  }, [conversations.length, default_value.length, createConversation])
}

export function useSwitchConversation() {
  return conversationStore(state=> state.switchConversation)
}
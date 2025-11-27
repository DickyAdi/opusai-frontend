import { create } from "zustand";
import { ChatConversationType } from "../type/conversation";

interface ConversationStoreState {
  conversations: ChatConversationType[];
  currentConversationId: string | null;
  createConversation: (title: string, convId?: string) => void;
  switchConversation: (id: string | null) => void;
}

export const conversationStore = create<ConversationStoreState>((set) => ({
  conversations: [],
  currentConversationId: null,
  createConversation: (title: string, convId?:string) => {
    set((state) => {
      const today = new Date();
      const id = crypto.randomUUID()
      const new_conv: ChatConversationType = {
        id: convId ||id,
        title: title,
        createdAt: today.toISOString(),
      };
      return {
        conversations: [new_conv, ...state.conversations],
        currentConversationId: new_conv.id,
      };
    });
  },
  switchConversation: (id: string | null) => set({ currentConversationId: id }),
}));

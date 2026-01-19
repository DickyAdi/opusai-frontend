import { create } from "zustand";
import { ChatConversationType } from "../type/conversation";
import { deleteConversation, fetchConversations, renameConversationTitle } from "../api/conversations";

interface ConversationStoreState {
  conversations: ChatConversationType[];
  currentConversationId: string | null;
  isLoadingConversations: boolean;
  conversationPage: number
  isFullyLoaded:boolean
  createConversation: (title: string, convId?: string) => void;
  switchConversation: (id: string | null) => void;
  loadConversation: () => Promise<void>;
  setConversation: (convs:ChatConversationType[]) => void;
  updateConversationTitle: (id:string, newName:string) => Promise<void>
  removeConversation: (id:string) => Promise<void>
}

export const conversationStore = create<ConversationStoreState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoadingConversations:false,
  conversationPage: 1,
  isFullyLoaded: false,
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
  setConversation: (convs:ChatConversationType[]) => {
    set((state) => ({conversations:[...state.conversations, ...convs]}))
  },
  switchConversation: (id: string | null) => set({ currentConversationId: id }),
  loadConversation: async () => {

    if (get().isLoadingConversations || get().isFullyLoaded) return

    const pageNumber = get().conversationPage
    set({isLoadingConversations:true})
    try {
      const conversations = await fetchConversations(pageNumber,20, undefined)
      const nextPage = pageNumber + 1
      get().setConversation(conversations.items)
      set({
        conversationPage:nextPage,
        isFullyLoaded: nextPage > conversations.total_pages
      })
    } catch (error) {
      console.error('Cannot fetch conversations: ', error)
    } finally {
      set({isLoadingConversations:false})
      }
    // }
  },
  updateConversationTitle: async (id:string, newTitle:string) => {
    try {
      await renameConversationTitle(id, newTitle)
      set((state) => ({conversations:state.conversations.map((c) => c.id === id ? {...c, title:newTitle}: c)}))
    } catch(err) {
      throw err
    }
  },
  removeConversation: async (id:string) => {
    try {
      await deleteConversation(id)
      set((state) => ({conversations: state.conversations.filter((c) => c.id !== id)}))
    } catch(err) {
      throw err
    }
  }
}));

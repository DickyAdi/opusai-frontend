'use client'
import ChatInputArea from "@/components/chat/layout/chat_input_area";
import { ChatListMessage } from "@/components/chat/list_message";
import { useAutoResponse } from "@/hooks/useChat";
import { useConversationId, useSwitchConversation } from "@/hooks/useConversation";
import { useEffect } from "react";



export default function ChatUserPage(
) {
  const currentConversationId= useConversationId()
  const switchConversation = useSwitchConversation()
  useAutoResponse()
  useEffect(() => {
    if (currentConversationId) {
      switchConversation(currentConversationId)
    }
  }, [currentConversationId, switchConversation])
  return (
    <>
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto space-y-4 max-w-3xl p-5">
        <ChatListMessage />
      </div>
    </div>
    <ChatInputArea isRedirect={false}/>
    </>
  );
}

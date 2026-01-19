'use client'
import ChatInputArea from "@/components/chat/layout/chat_input_area";
import { ChatListMessage } from "@/components/chat/list_message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversationId, useSwitchConversation } from "@/hooks/useConversation";
import { useEffect } from "react";



export default function ChatUserPage() {
  const currentConversationId= useConversationId()
  const switchConversation = useSwitchConversation()

  useEffect(() => {
    switchConversation(currentConversationId)
  }, [currentConversationId])
  return (
  <div className="relative flex flex-col h-screen">
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="mx-auto space-y-4 max-w-3xl pt-16 pb-48">
        <ChatListMessage />
      </div>
    </ScrollArea>
    <div className="absolute bottom-0 left-0 right-0">
      <ChatInputArea isRedirect={false}/>
    </div>
  </div>
    // <div className="relative flex flex-col h-full">
    //   <ScrollArea className="flex-1 overflow-y-auto pb-32">
    //     <div className="mx-auto space-y-4 max-w-3xl">
    //       <ChatListMessage />
    //     </div>
    //   </ScrollArea>
    //   <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
    //     <div className="h-32 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />
    //     <div className="pointer-events-auto">
    //       <ChatInputArea isRedirect={false}/>
    //     </div>
    //   </div>
    // </div>
  );
}

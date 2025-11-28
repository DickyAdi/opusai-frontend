import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useConversationId, useSwitchConversation } from "@/hooks/useConversation";
import { ChatConversationType } from "@/lib/type/conversation";
import Link from "next/link";
import { memo } from "react";


const ChatConversation = memo(function ChatConversation({id, title}: ChatConversationType) {
  const conversation_link = `/chat/${id}`
  const switchConversation = useSwitchConversation()
  const currentConversationId = useConversationId()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild onClick={() => switchConversation(id)} isActive={id === currentConversationId}>
        <Link href={conversation_link} prefetch={false}>
          {title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})


export {ChatConversation}
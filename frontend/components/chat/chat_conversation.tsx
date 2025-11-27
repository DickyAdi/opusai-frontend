import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useSwitchConversation } from "@/hooks/useConversation";
import { ChatConversationType } from "@/lib/type/conversation";
import Link from "next/link";
import { memo } from "react";


const ChatConversation = memo(function ChatConversation({id, title}: ChatConversationType) {
  const conversation_link = `/chat/${id}`
  const switchConversation = useSwitchConversation()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild onClick={() => switchConversation(id)}>
        <Link href={conversation_link} prefetch={false}>
          {title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})


export {ChatConversation}
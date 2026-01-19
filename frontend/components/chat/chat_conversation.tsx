import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useConversationId, useSwitchConversation } from "@/hooks/useConversation";
import { ChatConversationType } from "@/lib/type/conversation";
import Link from "next/link";
import { memo } from "react";
import { ConversationSettingLayout } from "./conversations/edit_conversation";


const ChatConversation = memo(function ChatConversation({id, title}: ChatConversationType) {
  const conversation_link = `/chat/${id}`
  const switchConversation = useSwitchConversation()
  const currentConversationId = useConversationId()
  return (
    <SidebarMenuItem>
      <div className="flex flex-row items-center rounded-lg hover:bg-linear-to-r hover:from-sidebar-accent hover:to-transparent to-90%">
          <SidebarMenuButton className="h-auto min-h-10 text-left text-nowrap py-2 w-full hover:bg-transparent data-[state=open]:hover:bg-transparent" asChild onClick={() => switchConversation(id)} isActive={id === currentConversationId}>
            <Link href={conversation_link} prefetch={false}>
                {title}
            </Link>
          </SidebarMenuButton>
          <ConversationSettingLayout id={id} title={title}/>
      </div>
    </SidebarMenuItem>
  )
})


export {ChatConversation}
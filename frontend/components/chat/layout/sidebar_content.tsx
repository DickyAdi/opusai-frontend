import {ChatConversation} from "../chat_conversation";
import { SidebarMenu } from "@/components/ui/sidebar";
import useConversation from "@/hooks/useConversation";
import { conversationStore } from "@/lib/store/conversation_store";
import { useRouter } from "next/router";

export default function ChatSidebarContent() {
  const {conversations} = useConversation()

  return (
    <SidebarMenu>
      {conversations.map((e) => (
        <ChatConversation key={e.id} id={e.id} title={e.title} createdAt={e.createdAt} />
      ))}
    </SidebarMenu>
  );
}

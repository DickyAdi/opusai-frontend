import { ChatConversationType } from "@/lib/type/conversation";
import ChatConversation from "../chat_conversation";
import { SidebarMenu } from "@/components/ui/sidebar";

const dummy_conversation: ChatConversationType[] = [
  {
    id: "dummy1",
    title: "Dummy title for conversation 1",
  },
  {
    id: "dummy2",
    title: "Dummy title for conversation 2",
  },
  {
    id: "dummy3",
    title: "Dummy title for conversation 3",
  },
];

export default function ChatSidebarContent() {
  return (
    <SidebarMenu>
      {dummy_conversation.map((e) => (
        <ChatConversation key={e.id} id={e.id} title={e.title} />
      ))}
    </SidebarMenu>
  );
}

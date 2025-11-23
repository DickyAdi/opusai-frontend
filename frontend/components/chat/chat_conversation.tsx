import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ChatConversationType } from "@/lib/type/conversation";
import Link from "next/link";

export default function ChatConversation({ id, title }: ChatConversationType) {
  const conversation_link = `/chat/${id}`;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={conversation_link} prefetch={false}>
          {title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

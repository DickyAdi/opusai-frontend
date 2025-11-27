import { SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import useChat from "@/hooks/useChat";
import useConversation from "@/hooks/useConversation";
import {redirect, RedirectType} from "next/navigation";
import Link from "next/link";

export default function ChatSidebarHeader() {
  const {switchConversation} = useConversation()
  const newChatHandler = () => {
   switchConversation(null)
  }

  return (
    <SidebarHeader>
      <ul className="flex flex-col gap-2">
        <li className="text-lg font-semibold">
          <div className="grid grid-cols-2">
            <div className="justify-self-start">
              <h1>OpusAI</h1>
            </div>
            <div className="justify-self-end">
              <span className="text-sm">katanya logo</span>
            </div>
          </div>
        </li>
        <li>
          <Button className="w-full justify-start p-0 text-md" variant="ghost" onClick={newChatHandler}>
            <Link href={`/chat`} className="w-full text-left" prefetch={false}>
              New chat
            </Link>
          </Button>
        </li>
      </ul>
    </SidebarHeader>
  );
}

"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarGroupContent,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ReactNode, useRef } from "react";
import ChatSidebarFooter from "@/components/chat/layout/sidebar_footer";
import ChatSidebarHeader from "@/components/chat/layout/sidebar_header";
import ChatSidebarContent from "@/components/chat/layout/sidebar_content";
import { useFetchModels } from "@/hooks/useChat";
import { useFetchPrompts } from "@/hooks/usePrompt";
import { useFetchConversations } from "@/hooks/useConversation";
import { ThemeToggle } from "@/components/utils/theme_change";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const conversationScrollContainer = useRef<HTMLDivElement>(null)
  useFetchModels();
  useFetchPrompts();
  // useFetchConversations();

  return (
    <SidebarProvider>
      <Sidebar>
        <ChatSidebarHeader />
        <SidebarContent>
          <Separator />
          <SidebarGroupContent ref={conversationScrollContainer} className="flex-1 sidebar-scroll">
            <ChatSidebarContent scrollContainer={conversationScrollContainer}/>
          </SidebarGroupContent>
        </SidebarContent>
        <Separator />
        <ChatSidebarFooter />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen overflow-visible">
        {/* <div className="flex flex-col h-screen overflow-hidden"> */}
          <header className="flex shrink-0 items-center gap-2 border-b p-2">
            <SidebarTrigger size="lg" />
            <ThemeToggle />
          </header>
          <div className="flex-1 overflow-hidden">

            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

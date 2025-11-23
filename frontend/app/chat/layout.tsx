"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarGroupContent,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import DarkModeToggle from "@/components/utils/darkmode-toggle";
import ChatSidebarFooter from "@/components/chat/layout/sidebar_footer";
import ChatSidebarHeader from "@/components/chat/layout/sidebar_header";
import ChatSidebarContent from "@/components/chat/layout/sidebar_content";
import ChatInputArea from "@/components/chat/layout/chat_input_area";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <ChatSidebarHeader />
        <SidebarContent>
          <Separator />
          <SidebarGroupContent className="flex-1 hover:overflow-auto overflow-hidden">
            <ChatSidebarContent />
          </SidebarGroupContent>
        </SidebarContent>
        <ChatSidebarFooter />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen overflow-visible">
          <header className="flex items-center gap-2 border-b p-2">
            <SidebarTrigger size="lg" />
            <DarkModeToggle className="justify-self-end" />
          </header>
          {children}
          <ChatInputArea />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

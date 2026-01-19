'use client'

import { DashboardSidebar } from "@/components/dashboard/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/utils/theme_change";
import { BookOpenIcon, BrainIcon, ChartBarIcon, ChevronDownIcon, HomeIcon, IdCardIcon, LayoutDashboardIcon, PencilIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";



export default function AIDashboardLayout({children}:{children:ReactNode}) {
  const activeUrl = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-2 m-2 flex flex-col">
          <h1 className="text-lg font-semibold">
            AI Manager
            Dashboard
          </h1>
          <Link href={'/chat'}>
            <Button variant={'outline'} className="justify-self-start"><HomeIcon className="h-4 w-4"/>Home</Button>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="p-4">

          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex flex-row items-center rounded-lg hover:bg-linear-to-r hover:from-accent hover:to-transparent to-90%">
                <SidebarMenuButton className="h-auto min-h-10 text-left text-nowrap py-2 w-full hover:bg-transparent data-[state=open]:hover:bg-transparent" asChild isActive={activeUrl === '/dashboard/overview' ? true : false}>
                  <Link href={"/dashboard/overview"}><LayoutDashboardIcon className="h-4 w-4"/>Overview</Link>
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>

          <DashboardSidebar triggerName="Account" subMenu={['overview', 'manage', 'role']} triggerIcon={UserIcon} subIcon={[ChartBarIcon, PencilIcon, IdCardIcon]} baseUrl="/dashboard/account"/>
          <DashboardSidebar triggerName="AI" subMenu={['overview', 'manage', 'knowledge']} triggerIcon={BrainIcon} subIcon={[ChartBarIcon, PencilIcon, BookOpenIcon]} baseUrl="/dashboard/ai"/>

        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="flex items-center gap-2 border-b p-2">
            <SidebarTrigger size="lg"/>
            <ThemeToggle />
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
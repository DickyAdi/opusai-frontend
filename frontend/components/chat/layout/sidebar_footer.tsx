`use client`

import { SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";


export default function ChatSidebarFooter() {
  const router = useRouter()


  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="h-12 p-4 cursor-pointer content-center items-center hover:bg-sidebar-accent rounded-lg">
          <div className="grid grid-cols-8 p-2">
            <Avatar className="col-span-2 justify-self-center">
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
            <div className="col-span-6 justify-self-start">
              <h2>Dummy profile</h2>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width)" sideOffset={10}>
          <DropdownMenuItem className="h-8" onClick={() => router.push('/dashboard/overview')}>Management dashboard</DropdownMenuItem>
          <DropdownMenuItem className="h-8" onClick={() => router.push('/settings/account')}>Setting</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="h-8" variant="destructive">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}

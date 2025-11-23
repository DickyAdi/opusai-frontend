import { SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface ChatSidebarFooterProp extends ComponentProps<"div"> {
  className?: string;
}

export default function ChatSidebarFooter({
  className,
  ...props
}: ChatSidebarFooterProp) {
  return (
    <SidebarFooter
      className={cn("h-12 grid grid-cols-8 items-center", className)}
      {...props}
    >
      <Avatar className="col-span-2 justify-self-center">
        <AvatarFallback>DM</AvatarFallback>
      </Avatar>
      <div className="col-span-6 justify-self-start">
        <h2>Dummy profile</h2>
      </div>
    </SidebarFooter>
  );
}

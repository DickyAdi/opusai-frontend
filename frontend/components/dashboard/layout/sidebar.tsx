import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { ChevronDownIcon, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";


export const DashboardSidebar = memo(function DashboardSidebar({triggerName, subMenu, baseUrl, triggerIcon:TriggerIcon, subIcon}:{triggerName:string, subMenu:string[], baseUrl:string, triggerIcon:LucideIcon, subIcon:LucideIcon[]}) {
  const activeUrl = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isActive = useMemo(() => {
    return activeUrl.split('/').includes(triggerName.toLowerCase())
  }, [activeUrl, triggerName])

  useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])

  
  return (
    <SidebarMenu>
      <Collapsible className="group/collapsible" open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex flex-row gap-2 items-center">
              <TriggerIcon className="h-4 w-4" />
              <span className="capitalize">{triggerName}</span>
            </div>
            <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {
              subMenu.map((e, idx) => (<DashboardSidebarSubMenu key={idx} baseUrl={baseUrl} name={e} icon={subIcon[idx]}/>))
            }
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
})

const DashboardSidebarSubMenu = memo(function DashboardSubMenu({baseUrl, name, icon:Icon}: {baseUrl:string, name:string, icon:LucideIcon}) {
  const url = `${baseUrl}/${name}`
  const activeUrl = usePathname()
  
  return (
    <SidebarMenuSubItem className="rounded-lg gradient-to-r">
      <SidebarMenuSubButton href={url} className="capitalize hover:bg-transparent" isActive={url === activeUrl ? true:false}>
        <Icon className="h-4 w-4"/>{name}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
})
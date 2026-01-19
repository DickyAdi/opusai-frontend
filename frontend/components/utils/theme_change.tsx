import { ChevronDown, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { memo, useMemo } from "react"
import { useSetTheme, useTheme } from "@/hooks/useTheme"
import { ScrollArea } from "../ui/scroll-area"
import { Button } from "../ui/button"

export const ThemeToggle = memo(function ThemeToggle() {
  const currentTheme = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-auto mr-4">
        <Button size={'sm'} variant={'outline'} className="self-end group">
          <Palette />{currentTheme}<ChevronDown className="transition-transform group-data-[state=open]:rotate-180"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ScrollArea className="max-h-[150px] overflow-y-auto">
          <ThemeDropDown />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

function ThemeDropDown() {
  const availableTheme = ["dark", "light", "nord", "dracula", 'solarized', "monokai"] as const
  const setTheme = useSetTheme()
  const currentTheme = useTheme()
  const renderedTheme = useMemo(() => {
    return availableTheme.map((theme, index) => (
      <DropdownMenuItem key={index} onClick={() => setTheme(theme)} className="capitalize text-sm">{theme}</DropdownMenuItem>
    ))
  }, [availableTheme, currentTheme, setTheme]) 
  
  return (
    <>
      {renderedTheme}
    </>
  )
}
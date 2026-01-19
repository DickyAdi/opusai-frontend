import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useParameterSettings } from "@/hooks/useChat";
import { ChatParameterSettingsType } from "@/lib/type/chat_parameter";
import { useRef, useState } from "react";


export function ChatParameterPopover({open, onOpenChange, onSave, children} : {open:boolean, onOpenChange:(open:boolean) => void, onSave:({temperature}:ChatParameterSettingsType) => void, children: React.ReactNode}) {
  const [temperature, setTemperature] = useState([0.7])
  const parameter = useParameterSettings()

  const submit_handler = () => {
    onSave({temperature:temperature[0]})
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {children}
      <PopoverContent className="flex flex-col gap-4 w-80 items-start" onPointerDownOutside={(e) => {}} onInteractOutside={(e) => {e.preventDefault()}}>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-sm">Temperature</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Controls AI deterministic output. Higher temperature will make AI be more expressive and lower is the opposite.</p>
          </TooltipContent>
        </Tooltip>
        <Slider defaultValue={[parameter.temperature]} value={temperature} onValueChange={setTemperature} step={0.1} max={1} min={0}/>
        <Button onClick={submit_handler} className="self-end">Save</Button>
      </PopoverContent>
    </Popover>
  )
}
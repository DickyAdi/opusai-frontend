import { InputGroupButton } from "@/components/ui/input-group";
import { useIsThinking, useSetParameterSettings } from "@/hooks/useChat";
import { Settings2Icon } from "lucide-react";
import { useState } from "react";
import { ChatParameterPopover } from "../parameter/parameter_settings";
import { PopoverAnchor } from "@/components/ui/popover";


function ChatParameterSettings() {
  const isThinking = useIsThinking()
  const [open, setOpen] = useState(false)
  const setParameter = useSetParameterSettings()


  return (
    <ChatParameterPopover open={open} onOpenChange={setOpen} onSave={setParameter}>
    <PopoverAnchor>
      <InputGroupButton
        size="icon-sm"
        aria-label="Change AI parameters"
        title="Parameter settings"
        disabled={isThinking}
        type="button"
        onClick={() => setOpen(true)}
      >
        <Settings2Icon />
      </InputGroupButton>
    </PopoverAnchor>
    </ChatParameterPopover>
  )
}

export {ChatParameterSettings}
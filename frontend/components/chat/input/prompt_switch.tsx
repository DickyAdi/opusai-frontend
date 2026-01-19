import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { InputGroupButton } from "@/components/ui/input-group"
import { useGetPrompt, useIsThinking, useSetPrompt } from "@/hooks/useChat"
import { useAvailablePrompts, useCreatePrompt, useIsLoadingPrompt } from "@/hooks/usePrompt"
import { ChevronDownIcon } from "lucide-react"
import { memo, useCallback, useMemo, useState } from "react"
// import { EditPromptDialog, CustomPromptMenuItem } from "../prompt/prompt"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CustomPromptMenuItem, PromptDialog } from "../prompt/prompt"

const ChatPromptSwitch = memo(function ChatPromptSwitch() {
  const isThinking = useIsThinking()
  const availablePrompts = useAvailablePrompts()
  const prompt_id = useGetPrompt()
  const setPrompt = useSetPrompt()
  const [showCustomDialog, setShowCustomDialog] = useState<boolean>(false)
  const isLoadingPrompt = useIsLoadingPrompt()

  const selectedTitle = useMemo(() => {
    if (!prompt_id) return ""
    const selected = availablePrompts.find((prompt) => prompt.id === prompt_id)
    return selected?.title || ""
  }, [prompt_id, availablePrompts])
  const createNewPrompt = useCreatePrompt()

  const select_handler = useCallback((id:string) => {
    setPrompt(id)
  }, [setPrompt])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <InputGroupButton
            id="selected-model"
            title="Change model"
            aria-label="Change model"
            disabled={isThinking}
            className="group"
          >
            <div className="flex items-center">
              <ChevronDownIcon className="size-3 transition-transform group-data-[state=open]:rotate-180" />
              {
                isLoadingPrompt ? (<Spinner className="size-4"/>) : (<span className="text-xs pl-1.5">{selectedTitle || "Choose prompt"}</span>)
              }
            </div>
          </InputGroupButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="sticky">
            <CustomPromptMenuItem onOpenDialog={() => setShowCustomDialog(true)}/>
          </div>
          <DropdownMenuSeparator />
          <ScrollArea className="max-h-[150px] overflow-y-auto">
            <div>
              {availablePrompts.map((prompt) => (
                <DropdownMenuItem 
                  key={prompt.id}
                  onClick={() => select_handler(prompt.id)}
                >
                  {prompt.title}
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <PromptDialog open={showCustomDialog} onOpenChange={setShowCustomDialog} onCreate={createNewPrompt} id="" title="" prompt="" type="user"/>
    </>
  )
})

export {ChatPromptSwitch}
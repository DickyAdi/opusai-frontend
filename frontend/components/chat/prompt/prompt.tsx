import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { useSetPrompt } from "@/hooks/useChat";
import { useAvailablePrompts } from "@/hooks/usePrompt";
import { ArrowUp, PencilIcon } from "lucide-react";
import { memo, useCallback, useState } from "react";



export function ChatPromptLayout() {


  return (
    <Dialog>
      <ChatPromptButtonTrigger />
      <DialogContent className="max-h-[60vh] overflow-y-auto">
        <ChatPromptList />
      </DialogContent>
    </Dialog>
  )
}

function ChatPromptButtonTrigger() {
  return (
    <DialogTrigger asChild>
      <Button className="w-full justify-start p-0 text-md" variant="ghost">
        Prompt
      </Button>
    </DialogTrigger>
  )
}

function ChatPromptList() {
  const availablePrompts = useAvailablePrompts()
  return (
    <Accordion type="single" collapsible>
      <DialogTitle>Prompts</DialogTitle>
      {
        availablePrompts.map((e) => (
          <ChatPromptElement key={e.id} id={e.id} title={e.title} prompt={e.prompt}/>
        ))
      }
    </Accordion>
  )
}

const ChatPromptElement = memo(function ChatPromptElement({id, title, prompt}: {id:string, title:string, prompt:string}) {
  return (
    <AccordionItem value={"id"+ id} key={id}>
      <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            {prompt}
          </p>
        </AccordionContent>
    </AccordionItem>
  )
})

export function CustomPromptMenuItem({onOpenDialog} : {onOpenDialog:() => void}) {

  return (
  <DropdownMenuItem key="custom-prompt-id" onClick={onOpenDialog}>
    Custom Prompt
  </DropdownMenuItem>
  )
}

export function CustomPromptDialog({open, onOpenChange, onSave, onSaveSetTitle}: {open:boolean, onOpenChange: (open:boolean) => void, onSave:(prompt:string) => void, onSaveSetTitle:(title:string) => void}) {
  const [customPrompt, setCustomPrompt] = useState("")

  const handle_save = () => {
    onSave(customPrompt)
    onSaveSetTitle("Custom Prompt")
    onOpenChange(false)
  }

  const handle_clear = () => {
    onSave("")
    onSaveSetTitle("")
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-description="A dialog to set custom prompt">
        <DialogHeader>
          <DialogTitle>Write custom prompt</DialogTitle>
          <DialogDescription>
            Write your custom prompt and click save to finish. This prompt will not be saved and only be used within this session
          </DialogDescription>
        </DialogHeader>
          <InputGroup>
            <InputGroupTextarea
            className="h-[32vh] overflow-y-auto"
            value={customPrompt}
            placeholder="Write your prompt..."
            onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </InputGroup>
          <DialogFooter>
            <Button variant="destructive" onClick={handle_clear}>Clear</Button>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button onClick={handle_save}>Save changes</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
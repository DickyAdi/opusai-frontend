import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import useDebounce from "@/hooks/useDebounce";
import { useAppendError } from "@/hooks/useError";
import { useAvailablePrompts, useCreatePrompt, useEditPrompt, useIsLoadingPrompt, useRemovePrompt } from "@/hooks/usePrompt";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { memo, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";


export function PromptList() {
  const availablePrompts = useAvailablePrompts()
  const isLoadingPrompt = useIsLoadingPrompt()
  const renderedPrompts = useMemo(() => {
    return availablePrompts.map((e) => (
          <PromptElement key={e.id} id={e.id} title={e.title} prompt={e.content} type={e.type}/>
      ))
  }, [availablePrompts])

  const spin = (
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner className="h-16 w-16"/>
    </div>
  )

  return (
    <>
      {
        isLoadingPrompt ? spin : 
        (
          <Accordion type="single" collapsible>
            {renderedPrompts}
          </Accordion>
        )
      }
    </>
    
  )
}

const PromptElement = memo(function ChatPromptElement({id, title, prompt, type}: {id:string, title:string, prompt:string, type:"user" | "default"}) {
  const typeBadge = type === "default" ? (<Badge variant="secondary" className="mx-auto">Default</Badge>) : (<Badge variant="secondary" className="mx-auto">User</Badge>)
  const [isEdit, setIsEdit] = useState(false)
  // const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const editPrompt = useEditPrompt()
  const createNewPrompt = useCreatePrompt()

  
  return (
    <>
      <AccordionItem value={"id_"+ id} key={id}>
        <AccordionTrigger>
          <div className="flex flex-row gap-2">
            <div className="flex w-16">
              {typeBadge}
            </div>
            <div>
              {title}
            </div>
          </div>
        </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ReactMarkdown>
              {prompt}
            </ReactMarkdown>
            <div className="flex flex-row gap-2">
              <Button variant="outline" size="icon-sm" onClick={() => setIsEdit(true)}>
                <PencilIcon/>
              </Button>
              <Button variant="outline" size="icon-sm" className="hover:bg-destructive hover:text-destructive-foreground" onClick={() => setIsDeleting(true)}>
                <Trash2Icon/>
              </Button>
            </div>
          </AccordionContent>
      </AccordionItem>
      <PromptDialog open={isEdit} onOpenChange={setIsEdit} onEdit={editPrompt} id={id} title={title} prompt={prompt} type={type}/>
      {/* <PromptDialog open={isCreating} onOpenChange={setIsCreating} onCreate={createNewPrompt} id={""} title={""} prompt={""} type={"user"}/> */}
      <DeletePromptDialog open={isDeleting} onOpenChange={setIsDeleting} id={id} title={title}/>
    </>
  )
})

function DeletePromptDialog({open, onOpenChange, id, title}:{open:boolean, onOpenChange:(e:boolean)=>void, id:string, title:string}) {
  const removePrompt = useRemovePrompt()
  const appendError = useAppendError()
  const [isDeleting, setIsDeleting] = useState(false)
  const handle_confirm = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await removePrompt(id)
    } catch(error) {
      const errMsg = error instanceof Error ? error.message : "Failed to delete prompt"
      appendError(errMsg)
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure want to delete <span className="font-extrabold">{title}</span> prompt?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the prompt!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handle_confirm} className="hover:bg-destructive">{isDeleting && (<Spinner />)}Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function CustomPromptMenuItem({onOpenDialog} : {onOpenDialog:() => void}) {

  return (
  <DropdownMenuItem key="custom-prompt-id" onClick={onOpenDialog}>
    Add prompt
  </DropdownMenuItem>
  )
}

export function PromptDialog({open, onOpenChange, onEdit, onCreate, id, title, prompt, type}:
  {
  open:boolean,
  onOpenChange: (open:boolean) => void,
  onEdit?:undefined | ((
    id:string, type:"user" | "default",
    title:string, prompt:string
  ) => Promise<void>),
  onCreate?:undefined | ((
    title:string, prompt:string, user_id?:string
  ) => void),
  id:string, title:string, prompt:string,
  type:"user" | "default"
  }
  ) {
  const [customPrompt, setCustomPrompt] = useState(prompt)
  const [customTitle, setCustomTitle] = useState(title)
  const debouncedPrompt = useDebounce(customPrompt, 500)
  const debouncedTitle = useDebounce(customTitle, 500)
  const [isProcessing, setIsProcessing] = useState(false)
  const appendError = useAppendError()

  const handle_save = async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    if (onEdit !== undefined) {
      try {
        await onEdit(id, type, customTitle, customPrompt)
      } catch(error) {
        const errMsg = error instanceof Error ? error.message : "Failed to create prompt"
        appendError(errMsg)
      } finally {
        setIsProcessing(false)
      }
    } else if (onCreate !== undefined) {
      const newPromptId = onCreate(customTitle, customPrompt)
      setIsProcessing(false)
      setCustomPrompt("")
      setCustomTitle("")
    }
    onOpenChange(false)
  }

  const handle_clear = () => {
    setCustomPrompt("")
    setCustomTitle("")
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-description={onEdit === undefined ? "A dialog to create new prompt":"A dialog to edit existing prompt"}>
        <DialogHeader>
          <DialogTitle>{onEdit === undefined? "Create prompt" : "Edit Prompt"}</DialogTitle>
          <DialogDescription>
            {
              onEdit !== undefined? "Edit the prompt and click save to save it for further use." : "Create a customized prompt for further use"
            }
          </DialogDescription>
        </DialogHeader>
          <InputGroup>
            <InputGroupInput value={customTitle} placeholder="Name your prompt..." onChange={(e) => setCustomTitle(e.target.value)}/>
          </InputGroup>
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
            <Button onClick={handle_save} disabled={!debouncedPrompt || !debouncedTitle ? true : false}>{isProcessing ? (<Spinner />) : null}Save changes</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRemoveConversation, useUpdateConversationTitle } from "@/hooks/useConversation";
import useDebounce from "@/hooks/useDebounce";
import { useAppendError } from "@/hooks/useError";
import { EllipsisIcon } from "lucide-react";
import { RefObject, useRef, useState } from "react";


export function ConversationSettingLayout({id, title}:{id:string, title:string}) {
  const [isEdit, setIsEdit] = useState(false)
  const updateConversationTitle = useUpdateConversationTitle()
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={buttonRef} size={"icon-sm"} onClick={() => setIsEdit(true)} variant={"ghost"} className="cursor-pointer ml-auto h-auto min-h-10 hover:bg-accent/50 hover:border-border hover:shadow-left">
        <EllipsisIcon className="h-4 w-4"/>
      </Button>
      <ConversationSettingsDropdown open={isEdit} onOpenChange={setIsEdit} anchorRef={buttonRef.current} convId={id} convName={title}/>
      {/* <ConversationRenameDialog open={isEdit} onOpenChange={setIsEdit} onEdit={updateConversationTitle} id={id} conversationName={title}/> */}
    </>
  )
}


function ConversationSettingsDropdown({open, onOpenChange, anchorRef, convId, convName}:{open:boolean, onOpenChange:(e:boolean) => void, convId:string, convName:string, anchorRef:any}) {
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const updateConversationTitle = useUpdateConversationTitle()
  const removeConversation = useRemoveConversation()

  return (
    <>
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <span ref={anchorRef} ></span>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem onClick={() => setIsEdit(true)}>Rename</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setIsDelete(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConversationSettingsDialog open={isEdit} onOpenChange={setIsEdit} onEdit={updateConversationTitle} id={convId} conversationName={convName}/>
      <ConversationSettingsDialog open={isDelete} onOpenChange={setIsDelete} onDelete={removeConversation} id={convId} conversationName={convName}/>
    </>
  )
}


function ConversationSettingsDialog({open, onOpenChange, id, conversationName, onEdit, onDelete}:{open:boolean, onOpenChange:(e:boolean) => void, id:string, conversationName:string, onEdit?:undefined|((id:string, newTitle:string) => Promise<void>), onDelete?:undefined | ((id:string) => Promise<void>)}) {
  const [newName, setNewName] = useState(conversationName)
  const [isProcessing, setIsProcessing] = useState(false)
  const debouncedName = useDebounce(newName, 500)
  const appendError = useAppendError()

  const saveHandler = async () => {
    if (!onEdit) return;
    setIsProcessing(true)
    try {
      await onEdit(id, newName)
    } catch(err) {
      const errMsg = err instanceof Error ? err.message : "Failed to edit conversation title"
      appendError(errMsg)
    } finally {
      setIsProcessing(false)
    }
    onOpenChange(false)
  }

  const deleteHandler = async () => {
    if (!onDelete) return;
    setIsProcessing(true)
    try {
      await onDelete(id)
    } catch(err) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete conversation"
      appendError(errMsg)
    } finally {
      setIsProcessing(false)
    }
    onOpenChange(false)
  }

  const clickHandler = () => {
    if (onEdit === undefined) {
      deleteHandler()
    } else if (onDelete === undefined) {
      saveHandler()
    } else {
      console.error('Must provide onDelete or onEdit!')
    }
  }

  const renameDialog = (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-description="A dialog to rename conversation">
        <DialogHeader>
          <DialogTitle>Rename conversation</DialogTitle>
        </DialogHeader>
        <Input value={newName} onChange={(e) => setNewName(e.target.value)}/>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button onClick={clickHandler} disabled={!debouncedName ? true : false}>{isProcessing? <Spinner /> : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const deleteDialog = (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure want to delete <span className="font-extrabold">{conversationName}</span>?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the conversation from our database and you will not be able to open this conversation again!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={clickHandler}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <>
      {
        onEdit === undefined ? deleteDialog : renameDialog
      }
    </>
  )
}
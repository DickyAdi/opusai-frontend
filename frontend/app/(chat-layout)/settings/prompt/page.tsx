'use client'

import { PromptDialog, PromptList } from "@/components/chat/prompt/prompt";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCreatePrompt } from "@/hooks/usePrompt";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";



export default function SettingsPromptPage() {
  const [isCreating, setIsCreating] = useState(false)
  const createNewPrompt = useCreatePrompt()
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="grid grid-cols-4 content-center ">
          <div className="col-span-2">
            <h1 className="text-2xl font-semibold mb-2">Prompt</h1>
          </div>
          <div className="col-span-2 justify-self-end">
            <Button className="cursor-pointer" onClick={() => setIsCreating(true)} variant={"ghost"}><PlusCircleIcon className="size-6"/>Add</Button>
          </div>
        </div>
        <Separator/>
        <ScrollArea className="min-h-48 max-h-104 sidebar-scroll">
          <PromptList />
        </ScrollArea>
      </div>
      <PromptDialog open={isCreating} onOpenChange={setIsCreating} onCreate={createNewPrompt} id="" title="" prompt="" type="user"/>
    </>
  )
}
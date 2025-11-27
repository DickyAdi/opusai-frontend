'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, DiscAlbum, FileIcon, SendIcon } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { useAutoResponse, useIsThinking, useSendMessage } from "@/hooks/useChat";
import useDebounce from "@/hooks/useDebounce";
import {redirect, RedirectType} from "next/navigation"


export default function ChatInputArea({isRedirect=true} : {isRedirect?:boolean}) {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const sendMessage = useSendMessage()
  const isThinking = useIsThinking()

  function prevent_default_enter(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const convId:string | null = sendMessage(query)
      setQuery("")
      if (isRedirect) {
        redirect(`/chat/${convId}`, RedirectType.push)
      }
    }
  }

  return (
    <div className="p-2 md:h-48 lg:h-42">
      <div className="flex gap-2 mx-auto max-w-3xl items-center">
        <InputGroup className="rounded-2xl">
          <InputGroupTextarea
            id="user-query"
            value={query}
            className="min-h-8 max-h-24"
            placeholder="Asks your question..."
            onKeyDown={prevent_default_enter}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isThinking}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              size="icon-sm"
              aria-label="upload file"
              title="File"
              disabled={isThinking}
            >
              <FileIcon />
            </InputGroupButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  id="selected-model"
                  title="Change model"
                  aria-label="Change model"
                  disabled={isThinking}
                >
                  <div className="flex items-center">
                    <ChevronDownIcon className="size-3" />
                    <span className="text-xs pl-1.5">Models</span>
                  </div>
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Dummy model 1</DropdownMenuItem>
                <DropdownMenuItem>Dummy model 2</DropdownMenuItem>
                <DropdownMenuItem>Dummy model 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <InputGroupButton
              aria-label="send question"
              title="Send"
              className="ml-auto"
              disabled={debouncedQuery === "" || isThinking ? (true) : (false)}
              onClick={() => {
                sendMessage(query)
                setQuery('')
              }}
            >
              <SendIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

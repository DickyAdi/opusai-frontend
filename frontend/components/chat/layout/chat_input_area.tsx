// 'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { SendIcon, X, XIcon } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useIsThinking, useSendMessage } from "@/hooks/useChat";
import useDebounce from "@/hooks/useDebounce";
// import {redirect, RedirectType, usePathname, useRouter} from "next/navigation"
import { ChatModelSwitch } from "../input/model_switch";
import { ChatFileUpload } from "../input/file_upload";
import { ChatPromptSwitch } from "../input/prompt_switch";
import { ChatFileContainer } from "../files/files";
import { Separator } from "@/components/ui/separator";
import { ChatParameterSettings } from "../input/parameter_settings";


export default function ChatInputArea({isRedirect=true} : {isRedirect?:boolean}) {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const sendMessage = useSendMessage()
  const isThinking = useIsThinking()
  const queryRef = useRef("")
  // const router = useRouter()
  // const pathname = usePathname()
  
  function handle_send_message() {
    if (!query || isThinking) return;

    queryRef.current = ""

    queryRef.current = query
    setQuery('')
    sendMessage(queryRef.current)
  }
  async function prevent_default_enter(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handle_send_message()
    }
  }

  return (
    // <div className="p-2 md:h-46 lg:h-46">
    <div className="p-2 pt-4 pb-8 bg-linear-to-t from-background from-85% to-transparent">
      <div className="h-6 mb-1.5">
        <ChatFileContainer />
      </div>
      <div className="flex gap-1 mx-auto max-w-3xl items-end">
        <InputGroup className="rounded-2xl">
          <InputGroupTextarea
            id="user-query"
            value={query}
            className="min-h-8 max-h-26 resize-none"
            placeholder="Asks your question..."
            onKeyDown={prevent_default_enter}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isThinking}
          />
          <InputGroupAddon align="block-end">
          <div className="flex items-center h-4 gap-2">
            <ChatFileUpload />
            <Separator orientation="vertical"/>
            <ChatModelSwitch />
            <Separator orientation="vertical"/>
            <ChatPromptSwitch />
            <Separator orientation="vertical"/>
            <ChatParameterSettings />
          </div>

            <InputGroupButton
              aria-label="send question"
              title="Send"
              className="ml-auto"
              disabled={debouncedQuery === "" || isThinking ? (true) : (false)}
              onClick={handle_send_message}
            >
              <SendIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
    // <div className="relative p-2">
    //   <div className="absolute inset-0 -top-20 bg-linear-to-t from-background from-30% to-transparent pointer-events-none" />
    //   <div className="relative">
    //     <div className="h-6 mb-1.5">
    //       <ChatFileContainer />
    //     </div>
    //     <div className="flex gap-1 mx-auto max-w-3xl items-center">
    //       <InputGroup className="rounded-2xl">
    //         <InputGroupTextarea
    //           id="user-query"
    //           value={query}
    //           className="min-h-8 max-h-22"
    //           placeholder="Asks your question..."
    //           onKeyDown={prevent_default_enter}
    //           onChange={(e) => setQuery(e.target.value)}
    //           disabled={isThinking}
    //         />
    //         <InputGroupAddon align="block-end">
    //         <div className="flex items-center h-4 gap-2">
    //           <ChatFileUpload />
    //           <Separator orientation="vertical"/>
    //           <ChatModelSwitch />
    //           <Separator orientation="vertical"/>
    //           <ChatPromptSwitch />
    //           <Separator orientation="vertical"/>
    //           <ChatParameterSettings />
    //         </div>

    //           <InputGroupButton
    //             aria-label="send question"
    //             title="Send"
    //             className="ml-auto"
    //             disabled={debouncedQuery === "" || isThinking ? (true) : (false)}
    //             onClick={handle_send_message}
    //           >
    //             <SendIcon />
    //           </InputGroupButton>
    //         </InputGroupAddon>
    //       </InputGroup>
    //     </div>
    //   </div>
    // </div>
  );
}

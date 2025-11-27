import { memo, useEffect, useMemo } from "react";
import { ChatAIThinking } from "./loading";
import { useIsThinking, useStreamingMessageId } from "@/hooks/useChat";


const ChatMessage = memo(function ChatMessage({id, role, message} : {id:string, role:'assistant' | 'user', message:string}) {
  console.log(`im rendered ${id}`)

  return (
    <>
      {role === "assistant" ? (
          <div className="flex flex-col justify-start">
            <div className="p-3 max-w-[80%] rounded-xl" id={id}>
              {message}
            </div>
          </div>
      ) : (
        <div className="flex justify-end">
          <div
            className="p-3 max-w-[80%] dark:bg-neutral-900 bg-zinc-200 rounded-xl"
            id={id}
          >
            {message}
          </div>
        </div>
      )}
    </>
  )
})

export {ChatMessage}
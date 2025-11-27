import ChatMessageType from "@/lib/type/chat_message";
import { ChatMessage } from "./chat_message";
import { memo, useMemo } from "react";
import { useGetMessageForConv, useIsThinking, useMessageScratchpad } from "@/hooks/useChat";
import { ChatAIThinking } from "./loading";


const ChatListMessage = memo(function ChatListMessage() {
  const messages:ChatMessageType[] = useGetMessageForConv()
  const messageScratchpad = useMessageScratchpad()
  const isThinking = useIsThinking()
  const renderedMessages = useMemo(() => {
    return messages.map((e) => (<ChatMessage key={e.id} id={e.id} role={e.role} message={e.message}/>))
  }, [messages])
  return (
    <>
    {
      renderedMessages
    }
    {(isThinking || messageScratchpad) && (
      <div className="flex flex-col justify-start">
        {isThinking ? (
          <ChatAIThinking />
        ) : (
          <div className="p-3 max-w-[80%] rounded-xl">
            {messageScratchpad}
          </div>
        )}
      </div>
    )}
    </>
  )
})

export {ChatListMessage}
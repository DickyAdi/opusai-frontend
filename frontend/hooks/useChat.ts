import * as React from "react";
import ChatMessageType from "@/lib/type/chat_message";
import { messageStore } from "@/lib/store/message_store";
import { useConversationId, useCreateConversation, useSwitchConversation } from "./useConversation";


interface useChatHook {
  messages: ChatMessageType[];
  shouldResponse: boolean
  sendMessage: (message:string) => string | null;
  getMessageForConv: ChatMessageType[];
  setShouldResponse: (e:boolean) => void;
}


export default function useChat():useChatHook {
  const messages = useMessages()
  const shouldResponse = useShouldResponse()
  const setShouldResponse = useSetShouldResponse()
  const getMessageForConv = useGetMessageForConv()
  const sendMessage = useSendMessage()
  
  useAutoResponse()

  return {
    messages,
    shouldResponse,
    setShouldResponse,
    getMessageForConv,
    sendMessage
  }
  
}

export function useUpdateMessageChunk() {
  return messageStore(state => state.updateMessageChunk)
}

export function useCreateEmptyMessageForStream() {
  return messageStore(state => state.createEmptyMessageForStream)
}

export function useAppendMessage() {
  return messageStore(state => state.appendMessage)
}

export function useMessages() {
  return messageStore(state => state.messages)
}

export function useShouldResponse() {
  return messageStore(state => state.shouldResponse)
}

export function useSetShouldResponse() {
  return messageStore(state => state.setShouldResponse)
}

export function useGetMessageForConv() {
  const messages = useMessages()
  const currentConversationId = useConversationId()
  const getMessageForConv = React.useMemo(() => {
    if (!currentConversationId) {
      return []
    }
    return messages.filter(msg => msg.conversationId === currentConversationId)
  }, [messages, currentConversationId])

  return getMessageForConv
}

export function useSendMessage() {
  const currentConversationId = useConversationId()
  const createConversation = useCreateConversation()
  const switchConversation = useSwitchConversation()
  const setShouldResponse = useSetShouldResponse()
  const appendMessage = useAppendMessage()

  const sendMessage = React.useCallback(
    (message:string) => {
      let activeConvId = currentConversationId
      
      if (!message) {
        console.log('ERROR, cannot send a message with empty message.')
        return null
      }
  
      if (!activeConvId) {
        const convId = crypto.randomUUID()
        createConversation(`dummy ${Math.random()}`, convId)
        activeConvId = convId
        switchConversation(activeConvId)
      }
  
      if (!activeConvId) {
        console.log('ERROR, conv id is null')
        return null
      }
  
      appendMessage({
        conversationId:activeConvId,
        role:'user',
        message: message
      })
      setShouldResponse(true)
      return activeConvId
    }, [currentConversationId, createConversation, switchConversation, appendMessage, setShouldResponse]
  )

  return sendMessage
}

export function useIsThinking() {
  return messageStore(state => state.isThinking)
}

export function useSetIsThinking() {
  return messageStore(state => state.setIsThinking)
}

export function useStreamingMessageId() {
  return messageStore(state => state.streamingMessageId)
}

export function useSetStreamingMessageId() {
  return messageStore(state => state.setStreamingMessageId)
}

export function useMessageScratchpad() {
  return messageStore(state => state.messageScratchpad)
}

export function useSetMessageScratchpad() {
  return messageStore(state => state.setMessageScratchpad)
}

export function useAutoResponse() {
  const isResponding = React.useRef(false)
  const shouldResponse = useShouldResponse()
  const currentConversationId = useConversationId()
  const appendMessage = messageStore(state => state.appendMessage)
  const setShouldResponse = useSetShouldResponse()
  const createEmptyMessageForStream = useCreateEmptyMessageForStream()
  const updateMessageChunk = useUpdateMessageChunk()
  const isThinking = useIsThinking()
  const setIsThinking = useSetIsThinking()
  const messageScratchpad = useMessageScratchpad()
  const setMessageScratchpad = useSetMessageScratchpad()

  React.useEffect(() => {
    const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))
    if (shouldResponse && currentConversationId && !isResponding.current) {
      setShouldResponse(false)
      isResponding.current = true

      const dummy_responses = [
        "Short answer!",
        "This is a medium-length response that provides a bit more context.",
        "This is a much longer response that goes into detail about various topics and simulates what a real assistant might say when asked a complex question...",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque nisi, quos obcaecati praesentium ut eveniet? Ex explicabo laudantium laboriosam consequuntur mollitia blanditiis asperiores corrupti unde autem magni? Exercitationem, ea eaque."
      ]

      const simulateFetch = async () => {
        setIsThinking(true)
        await delay(5000)
        const resp = dummy_responses[Math.floor(Math.random() * dummy_responses.length)]
        return resp
      }

      const simulateStreaming = async () => {
        const resp = await simulateFetch()
        const words = resp.split(' ')

        setIsThinking(false)
        let accumulated:string = ''
        for (let i=0; i < words.length; i++) {
          accumulated += (i > 0 ? ' ' : '') + words[i]
          setMessageScratchpad(accumulated)

          await delay(20+Math.random() * 60)
        }
        appendMessage({
          conversationId:currentConversationId,
          role:'assistant',
          message:accumulated
        })
        setMessageScratchpad('')
        isResponding.current = false
      }

      simulateStreaming()
    }
  }, [shouldResponse, currentConversationId, setShouldResponse, appendMessage, updateMessageChunk, setMessageScratchpad])
}


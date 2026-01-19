import { create } from "zustand";
import ChatMessageType from "../type/chat_message";
import { fetchDummyModels, fetchModels } from "../api/models";
import { ChatParameterSettingsType } from "../type/chat_parameter";
import { ChatParameterSettings } from "@/components/chat/input/parameter_settings";
import { fetchConversationMessages } from "../api/conversations";
import { persist, createJSONStorage } from "zustand/middleware";
import { uploadFiles, UploadFilesResponseSchema } from "../api/files";
import { ModelType } from "../type/model";

interface CacheEntry<T> {
  data: T
  timestamp: number
  isStale: boolean
}

interface MessageStoreState {
  cache: Record<string, CacheEntry<any>>
  messages: ChatMessageType[];
  shouldResponse:boolean;
  isStreaming:boolean;
  isThinking:boolean;
  messageScratchpad:string;
  availableModels:ModelType[];
  selectedModel:string;
  isLoadingModels: boolean;
  isLoadingMessages:boolean;
  prompt_id: string
  files: File[]
  parameter: ChatParameterSettingsType
  isProcessing: boolean
  createEmptyMessageForStream: (conversationId:string) => string;
  updateMessageChunk: ({id, chunk}: {id:string, chunk:string}) => void;
  appendMessage: ({
    conversationId,
    role,
    message,
    id
  }: {
    conversationId:string;
    role: "assistant" | "user";
    message: string;
    id?:string
  }) => void;
  setShouldResponse: (e:boolean) => void;
  setIsThinking: (e:boolean) => void;
  setIsStreaming: (e:boolean) => void;
  setMessageScratchpad: (value: (string | ((prev:string) => string))) => void;
  setSelectedModel: (model:string) => void;
  setAvailableModels: (models:ModelType[]) => void;
  loadModels: () => Promise<void>;
  setPrompt_id: (id:string) => void;
  appendFile: (file:File) => void;
  removeFile: (index:number) => void;
  setParameter: ({temperature}:ChatParameterSettingsType) => void;
  getConversationMessages: (conversation_id:string) => Promise<void>;
  updateUserMessageId: (tempId:string, actualId:string) => void;
  setIsProcessing: (status:boolean) => void;
  uploadFiles: (files:File[]) => Promise<UploadFilesResponseSchema>;
  clearFiles: () => void;
  clearMessages: () => void
}

const appendMessageFunc = ({state, role, message, conversationId, id,} : {state:MessageStoreState, role:"assistant" | 'user', message:string, conversationId:string, id?:string}) => {
      const last_msg:ChatMessageType = state.messages[state.messages.length - 1]
      if (last_msg?.role === 'assistant' && last_msg?.content === message) {
        return state
      }
      const new_message: ChatMessageType = {
        id: id? id:crypto.randomUUID(),
        conversationId:conversationId,
        role: role,
        content: message,
      };
      return {
        messages: [...state.messages, new_message],
      };
}

export const messageStore = create<MessageStoreState>()(
  persist(
      (set, get) => ({
      cache: {},
      messages: [],
      isThinking: false,
      isStreaming:false,
      messageScratchpad:"",
      availableModels: [],
      selectedModel: "",
      isLoadingModels: false,
      isLoadingMessages: false,
      prompt_id:"",
      files: [],
      parameter: {temperature:0.7},
      isProcessing: false,
      updateMessageChunk: ({id, chunk}: {id:string, chunk:string}) => {
        set((state) => {
          return {messages:state.messages.map((msg) => {
            if (msg.id === id) {
              return {
                ...msg,
                message: chunk
              }
            } else {
              return msg
            }
          })}
        })
      },
      createEmptyMessageForStream: (conversationId:string) => {
        const empty_msg_id:string = crypto.randomUUID()
        set((state) => {
          return appendMessageFunc({state:state, role:"assistant", message:"", conversationId:conversationId, id:empty_msg_id})
        })
        return empty_msg_id
      },
      appendMessage: ({
        conversationId,
        role,
        message,
        id,
      }: {
        conversationId: string
        role: "assistant" | "user";
        message: string;
        id?:string
      }) => {
        set(state => ({messages:appendMessageFunc({state, role, conversationId, message, id}).messages}))
      },
        shouldResponse: false,
        setShouldResponse: (e:boolean) => set({shouldResponse: e}),
        setIsThinking: (e:boolean) => set({isThinking: e}),
        setIsStreaming: (e:boolean) => set({isStreaming: e}),
        // setMessageScratchpad: (value:string) => set({messageScratchpad: value}),
        setMessageScratchpad: (value: (string | ((prev:string) => string))) => set((state) => ({
          messageScratchpad: typeof value === 'function' ? value(state.messageScratchpad) : value
        })),
        setAvailableModels: (models:ModelType[]) => set({availableModels:models, selectedModel:get().selectedModel || models[0].name || ""}),
        setSelectedModel: (model:string) => set({selectedModel:model}),
        loadModels: async () => {
          const CACHE_TTL = 5 * 60 * 1000
          set({isLoadingModels:true})
          try {
            // const models = await fetchDummyModels() //this is for UI dev to replicate a dummies
            const cachedModels = get().cache['available_models']
            const now = Date.now()
            if (cachedModels && (now - cachedModels.timestamp) < CACHE_TTL) {
              console.log('Data already exists, returning with the cache data')
              get().setAvailableModels(cachedModels.data)
              return
              // return cachedModels.data
            }
            const models = await fetchModels()

            // console.log(models)
            // get().setAvailableModels(models)
            set((state) => ({
              cache: {
                ...state.cache,
                available_models : { data:models, timestamp: now, isStale:false }
              }
            }))
            get().setAvailableModels(models)
          } catch(error) {
            // console.error("Cannot fetch models: ", error)
            throw Error('Cannot fetch models')
          } finally {
            set({isLoadingModels:false})
          }
        },
        setPrompt_id: (id:string) => set({prompt_id:id}),
        appendFile: (file:File) => set((state) => ({files: [...state.files, file]})),
        removeFile: (index:number) => set((state) => {
          return {files: state.files.filter((_, i) => i !== index)}
        }),
        setParameter: ({temperature}:ChatParameterSettingsType) => set({parameter: {temperature}}),
        getConversationMessages: async (conversation_id:string) => {
          set({isLoadingMessages:true})
          try {
            const messages = await fetchConversationMessages(conversation_id)
            set({messages:messages})
          } catch(error) {
            throw Error('Cannot fetch messages for this conversation')
            // console.error(`Cannot fetch messages for conversation id ${conversation_id}`)
          } finally {
            set({isLoadingMessages:false})
          }
        },
        updateUserMessageId: (tempId:string, actualId:string) => {
          set((state) => ({messages: state.messages.map((msg) => 
            msg.id === tempId && msg.role === 'user' ?
            {...msg, id:actualId}
            : msg
          )}))
        },
        clearMessages: () => set({messages:[]}),
        clearFiles: () => set({files:[]}),
        setIsProcessing: (status:boolean) => set({isProcessing:status}),
        uploadFiles: async (files: File[]) => {
          get().setIsProcessing(true)
          const data = await uploadFiles(files)
          return data
        },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedModel: state.selectedModel,
        prompt_id: state.prompt_id,
        parameter: state.parameter
      })
    }
  )
);

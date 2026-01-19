export default interface ChatMessageType {
  id: string;
  conversationId: string;
  role: "assistant" | "user";
  content: string;
}

export type ChatChunkData = {
  message_id:string
  type:"text_delta"
  content:string
  index:number
}

export type ChatCompletionData = {
  message_id:string
  conversation_id:string
  input_id:string
  tokens_used:object
}

export type ChatErrorData = {
  message_id:string,
  code:string,
  message:string
}

export type ChatStartData = {
  message_id:string
  conversation_id:string
  title:string
  input_id:string
  response_id:string
}
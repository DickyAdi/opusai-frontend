export default interface ChatMessageType {
  id: string;
  conversationId: string;
  role: "assistant" | "user";
  message: string;
}

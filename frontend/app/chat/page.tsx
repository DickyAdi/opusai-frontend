'use client'

import ChatInputArea from "@/components/chat/layout/chat_input_area";

export default function ChatPage() {
  return (
    <>
      <div className="flex items-center justify-center flex-1">
        <div>
          <h1 className="text-4xl font-extrabold">Ask me a question</h1>
        </div>
      </div>
      <ChatInputArea />
    </>
  );
}

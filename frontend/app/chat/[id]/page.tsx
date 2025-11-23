import ChatMessage from "@/components/chat/chat_message";
import ChatMessageType from "@/lib/type/chat_message";

const dummy_chat: ChatMessageType[] = [
  {
    id: crypto.randomUUID(),
    role: "user",
    message: "Dummy user input?",
  },
  {
    id: crypto.randomUUID(),
    role: "assistant",
    message: "Dummy assistant answer?",
  },
  {
    id: crypto.randomUUID(),
    role: "user",
    message: "Dummy user input?",
  },
  {
    id: crypto.randomUUID(),
    role: "assistant",
    message: "Dummy assistant answer?",
  },
];

export default async function ChatUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto space-y-4 max-w-3xl p-5">
        {dummy_chat.map((e) => (
          <ChatMessage
            key={e.id}
            id={e.id}
            role={e.role}
            message={`${id + " " + e.message}`}
          />
        ))}
      </div>
    </div>
  );
}

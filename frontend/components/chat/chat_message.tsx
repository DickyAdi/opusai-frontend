import ChatMessageType from "@/lib/type/chat_message";

export default function ChatMessage({ id, role, message }: ChatMessageType) {
  return (
    <>
      {role === "assistant" ? (
        <div className="flex justify-start">
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
  );
}

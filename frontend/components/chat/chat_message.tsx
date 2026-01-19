import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm"

const ChatMessage = memo(function ChatMessage({id, role, message} : {id:string, role:'assistant' | 'user', message:string}) {
  console.log(`im rendered ${id}`)

  return (
    <>
      {role === "assistant" ? (
          <div className="flex flex-col justify-start">
            <div className="chat-message ai-message p-3 max-w-[80%] wrap-break-word rounded-xl prose" id={id}>
              <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
                {message}
            </ReactMarkdown>
            </div>
          </div>
      ) : (
        <div className="flex justify-end">
          <div
            className="chat-message user-message p-3 max-w-[80%] warp-break-word rounded-xl prose"
            id={id}
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {message}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  )
})

export {ChatMessage}
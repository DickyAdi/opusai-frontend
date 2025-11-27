import { Spinner } from "@/components/ui/spinner"

export function ChatAIThinking() {
  return (
      <div className="flex items-center gap-2 p-3 border dark:border-zinc-900 border-neutral-900 rounded-xl">
        <Spinner className="h-4 w-4" />
        <span className="text-sm">AI is Thinking...</span>
      </div>
  )
}
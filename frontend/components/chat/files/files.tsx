import { Button } from "@/components/ui/button"
import { useGetFiles, useIsThinking, useRemoveFile } from "@/hooks/useChat"
import { XIcon } from "lucide-react"
import { memo, useMemo } from "react"

export function ChatFileContainer() {
  const files = useGetFiles()
  const removeFile = useRemoveFile()
  const rendered_card_files = useMemo(() => {
    return files.map((file, index) => (<ChatFileCard key={"file-"+index} index={index} delete_handler={() => removeFile(index)} file={file}/>))
  }, [files])
  return (
    <div className="flex flex-row mx-auto max-w-3xl px-2 items-center">
      {rendered_card_files}
    </div>
  )
}

const ChatFileCard = memo(
  function ChatFileCard({index, file, delete_handler} : {index:number, file:File, delete_handler:(index:number) => void}) {
    const isThinking = useIsThinking()
    const handleOpenFile = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button[aria-label="delete"]')) {
        return
      }
      const fileUrl = URL.createObjectURL(file)

      if (file.type === 'application/pdf' || file.type === "text/plain") {
        window.open(fileUrl, '_blank')
      } else {
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setTimeout(() => URL.revokeObjectURL(fileUrl), 100)
    }


    return (
      <div className="flex h-6 w-32 rounded-xl mx-1 bg-linear-to-r from-accent to-transparent ">
        <span className="text-sm line-clamp-1 px-1 cursor-pointer" onClick={handleOpenFile}>{file.name}</span>
        <Button disabled={isThinking} variant="ghost" size="icon-sm" className="rounded-full h-4 w-4 mx-1 my-1 cursor-pointer hover:bg-accent-foreground hover:text-accent" onClick={() => delete_handler(index)}>
          <XIcon size={12}/>
        </Button>
      </div>
    )
  }
)
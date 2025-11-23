import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, FileIcon, SendIcon } from "lucide-react";
import { KeyboardEvent } from "react";

function prevent_default_enter(e: KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
  }
}

export default function ChatInputArea() {
  return (
    <div className="p-2 md:h-56 lg:h-48">
      <div className="flex gap-2 mx-auto max-w-3xl items-center">
        <InputGroup className="rounded-2xl">
          <InputGroupTextarea
            id="user-query"
            className="min-h-8 max-h-24"
            placeholder="Asks your question..."
            onKeyDown={prevent_default_enter}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              size="icon-sm"
              aria-label="upload file"
              title="File"
            >
              <FileIcon />
            </InputGroupButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  id="selected-model"
                  title="Change model"
                  aria-label="Change model"
                >
                  <div className="flex items-center">
                    <ChevronDownIcon className="size-3" />
                    <span className="text-xs pl-1.5">Models</span>
                  </div>
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Dummy model 1</DropdownMenuItem>
                <DropdownMenuItem>Dummy model 2</DropdownMenuItem>
                <DropdownMenuItem>Dummy model 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <InputGroupButton
              aria-label="send question"
              title="Send"
              className="ml-auto"
            >
              <SendIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

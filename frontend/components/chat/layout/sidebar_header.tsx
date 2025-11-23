import { SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function ChatSidebarHeader() {
  return (
    <SidebarHeader>
      <ul className="flex flex-col gap-2">
        <li className="text-lg font-semibold">
          <div className="grid grid-cols-2">
            <div className="justify-self-start">
              <h1>OpusAI</h1>
            </div>
            <div className="justify-self-end">
              <span className="text-sm">katanya logo</span>
            </div>
          </div>
        </li>
        <li>
          <Button className="w-full justify-start p-0 text-md" variant="ghost">
            New chat
          </Button>
        </li>
      </ul>
    </SidebarHeader>
  );
}

import { SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import useConversation from "@/hooks/useConversation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, SquareArrowOutUpRightIcon } from "lucide-react";
import Image from "next/image";

export default function ChatSidebarHeader() {
  const {switchConversation} = useConversation()
  const router = useRouter()
  const newChatHandler = () => {
   switchConversation(null)
   router.push('/chat')
  }

  return (
    <SidebarHeader>
      <ul className="flex flex-col gap-2 pt-2 py-2 pb-1">
        <li className="text-lg font-semibold">
          <div className="grid grid-cols-2 mb-2">
            <div className="justify-self-start">
              <Link href={'/'}>
              <div className="flex flex-row gap-2">
                <div>
                  <Image src={"/logo_nofont.png"} width={40} height={40} className="p-0.5" alt="OpusAI"/>
                </div>
                <div>
                  <h1>OpusAI</h1>
                </div>
              </div>
                {/* <Image src={"/logo_nofont.png"} width={40} height={40} className="p-0.5" alt="OpusAI"/> */}
              {/* </Link> */}
              {/* <Link href="'/"> */}
                {/* <h1>OpusAI</h1> */}
              </Link>
            </div>
            {/* <div className="justify-self-end">
              <Link href={'/'}>
                <Image src={"/logo_nofont.png"} width={40} height={40} className="p-0.5" alt="OpusAI"/>
              </Link>
            </div> */}
          </div>
        </li>
        <li>
          <Button className="mb-2 w-full text-md justify-start cursor-pointer" variant="default" onClick={newChatHandler}>
            <SquareArrowOutUpRightIcon className="h-4 w-4"/>New chat
          </Button>
          <Link href="/settings/general">
            <Button className="w-full text-md justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" variant="ghost">
              <Settings className="h-4 w-4 p-0"/>Settings
            </Button>
          </Link>
        </li>
      </ul>
    </SidebarHeader>
  );
}

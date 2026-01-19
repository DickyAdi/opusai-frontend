import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BrainIcon, HomeIcon, ScrollTextIcon, SettingsIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsLayout({children} : {children:ReactNode}) {
  return (
    <div className="px-8 py-6">
      <h1 className="mb-6 px-4 text-3xl font-semibold">Settings</h1>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full max-w-1/6 text-base font-semibold gap-1">
          <Link href={"/settings/general"}>
            <Button variant="ghost" className="cursor-pointer justify-start w-full">
                <SettingsIcon className="h-4 w-4"/> General
            </Button>
          </Link>
          <Link href={"/settings/account"}>
            <Button variant="ghost" className="cursor-pointer justify-start w-full">
                <UserRoundIcon className="h-4 w-4"/>Account
            </Button>
          </Link>
          <Link href={"/settings/prompt"}>
            <Button variant="ghost" className="cursor-pointer justify-start w-full">
                <ScrollTextIcon className="h-4 w-4"/>Prompt Manager
            </Button>
          </Link>
          <Link href={"/settings/ai"}>
              <Button variant="ghost" className="cursor-pointer justify-start w-full">
                  <BrainIcon className="h-4 w-4"/>AI Manager
              </Button>
          </Link>
        </div>
        <div className="flex flex-col w-full px-4 flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";



export default function SettingsAIPage() {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl ">AI Manager</h1>
      <Separator className="my-2"/>
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center pb-2">
          <InfoIcon className="h-4 w-4"/>
          <span className="font-light text-sm">Go to dashboard by clicking the button below</span>
        </div>
        <Link href={"/dashboard/ai/overview"}>
          <Button variant={"outline"}><SquareArrowOutUpRightIcon />Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
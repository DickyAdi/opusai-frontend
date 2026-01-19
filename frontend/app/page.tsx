"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      <div className="h-24">
        <h1 className="font-bold tracking-wide dark:text-zinc-50 text-6xl">
          OpusAI
        </h1>
      </div>
      <div className="h-12">
        <Button
          variant="ghost"
          className="text-2xl p-5 dark:text-zinc-50"
          size="lg"
        >
          <Link href="/chat" prefetch={false}>
            Proceed to chat
          </Link>
        </Button>
      </div>
    </div>
  );
}

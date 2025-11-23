"use client";

import DarkModeToggle from "@/components/utils/darkmode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DummyChatMessage {
  role: "assistant" | "user";
  message: string;
}

interface DummyChat {
  id: string;
  content: string;
}

function create_dummy_conversation(n: number): DummyChatMessage[] {
  const chat_message_arr: DummyChatMessage[] = [];
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      chat_message_arr.push({
        role: "user",
        message: "This is dummy human message?",
      });
    } else {
      chat_message_arr.push({
        role: "assistant",
        message: "This is dummy assistant response!",
      });
    }
  }
  return chat_message_arr;
}

function create_dummy_chat(n: number): DummyChat[] {
  const dummy_chat: DummyChat[] = [];

  for (let i = 0; i < n; i++) {
    dummy_chat.push({
      id: `dummy${i}`,
      content: "This is dummy chat",
    });
  }

  return dummy_chat;
}

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      <DarkModeToggle />
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

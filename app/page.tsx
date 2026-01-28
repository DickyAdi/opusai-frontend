"use client";

import { Button } from "@/components/ui/button";
import { useSwitchConversation } from "@/hooks/useConversation";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
	const switchConversation = useSwitchConversation();

	useEffect(() => {
		switchConversation(null);
	}, [switchConversation]);

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

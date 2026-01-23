import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { FileReference } from "./files/file_reference";
import { CopyButton } from "../utils/copy_button";
import type { RefType } from "@/lib/type/chat_message";

const ChatMessage = memo(function ChatMessage({
	id,
	sender,
	message,
	references,
}: {
	id: string;
	sender: "assistant" | "user";
	message: string;
	references?: RefType[];
}) {
	console.log(`im rendered ${id}`);

	const memoizedReference = useMemo(() => {
		if (references && references.length >= 0) {
			return references.map((e) => {
				if (e.source_type === "uploaded_file") {
					return (
						<FileReference
							key={crypto.randomUUID()}
							reference={e}
							variant="non-active"
						/>
					);
				}
				if (e.source_type === "knowledge_base") {
					return <FileReference key={e.source_id} reference={e} />;
				}
				if (e.source_type === "tabular") {
					return (
						<FileReference
							key={crypto.randomUUID()}
							reference={e}
							variant="non-active"
						/>
					);
				}
				return null;
			});
		}
		return null;
	}, [references]);

	return (
		<>
			{sender === "assistant" ? (
				<div className="flex flex-col justify-start">
					<div
						className="chat-message ai-message p-3 max-w-[80%] wrap-break-word rounded-xl prose"
						id={id}
					>
						<ReactMarkdown
							rehypePlugins={[rehypeHighlight]}
							remarkPlugins={[remarkGfm]}
						>
							{message}
						</ReactMarkdown>
					</div>
					<div className="flex flex-row mt-1 gap-x-2 items-center">
						<CopyButton content={message} />
						<div>
							{memoizedReference && memoizedReference.length >= 0 ? (
								<div className="flex flex-row bg-card rounded-lg p-1.5 items-center">
									<p className="text-xs">
										AI is referencing to {memoizedReference?.length} knowledge
									</p>
									{memoizedReference}
								</div>
							) : (
								<p className="text-xs">AI has no reference</p>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="flex justify-end">
					<div
						className="chat-message user-message p-3 max-w-[80%] warp-break-word rounded-xl prose"
						id={id}
					>
						<ReactMarkdown rehypePlugins={[rehypeHighlight]}>
							{message}
						</ReactMarkdown>
					</div>
				</div>
			)}
		</>
	);
});

export { ChatMessage };

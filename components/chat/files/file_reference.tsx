import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { File } from "lucide-react";
import type { RefType } from "@/lib/type/chat_message";
import { memo, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useFetchChunk } from "@/hooks/useRag";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const FileReference = memo(function FileReference({
	reference,
	variant = "active",
}: {
	reference: RefType;
	variant?: "active" | "non-active";
}) {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const baseButtonStyle = "rounded-full mx-auto my-auto h-6 w-6";

	return (
		<>
			<HoverCard>
				<HoverCardTrigger asChild>
					<Button
						className={
							variant === "active"
								? baseButtonStyle
								: cn([
										baseButtonStyle,
										"hover:bg-transparent! hover:text-foreground",
									])
						}
						variant={"ghost"}
						onClick={() => setOpenModal(true)}
					>
						<File className="h-4 w-4" />
					</Button>
				</HoverCardTrigger>
				<HoverCardContent className="w-80">
					<div className="flex">
						<div className="space-y-1">
							<h4 className="text-sm font-semibold">{reference.source_name}</h4>
							{reference.source_type === "knowledge_base" ||
							reference.source_type === "uploaded_file" ? (
								<p className="text-xs text-balance">{reference.preview}</p>
							) : null}
							{/* <p className="text-xs text-balance">{reference.preview}</p> */}
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>
			{reference.source_type === "knowledge_base" ? (
				<FileReferenceModal
					onOpen={openModal}
					setOnOpen={setOpenModal}
					refName={reference.source_name}
					refParentId={reference.location.parent_id}
				/>
			) : null}
		</>
	);
});

function FileReferenceModal({
	onOpen,
	setOnOpen,
	refName,
	refParentId,
}: {
	onOpen: boolean;
	setOnOpen: (open: boolean) => void;
	refName: string;
	refParentId: string;
}) {
	const { getChunk } = useFetchChunk();
	const [content, setContent] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const callAPI = async () => {
			setIsLoading(true);
			try {
				const data = await getChunk(refParentId);
				setContent(data.content);
			} catch (error) {
				setContent("FAILED TO RETRIEVE DATA");
			} finally {
				setIsLoading(false);
			}
		};
		if (refParentId) {
			callAPI();
		}
	}, [getChunk, refParentId]);

	return (
		<Dialog open={onOpen} onOpenChange={setOnOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-xl">{refName}</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<Spinner />
				) : (
					<div className="text-sm text-justify rounded-lg h-128">
						<ScrollArea className="h-full p-4">
							<ReactMarkdown
								rehypePlugins={[rehypeHighlight]}
								remarkPlugins={[remarkGfm]}
							>
								{content}
							</ReactMarkdown>
						</ScrollArea>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export { FileReference };

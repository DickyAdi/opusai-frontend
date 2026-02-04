import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BookOpenCheckIcon, FileUpIcon, Table2Icon } from "lucide-react";
import type { RefType } from "@/lib/type/chat_message";
import { memo, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useFetchChunk, useFetchPdf } from "@/hooks/useRag";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PDFViewer } from "@/components/ui/pdf-reader";

const FileReference = memo(function FileReference({
	reference,
	variant = "active",
}: {
	reference: RefType;
	variant?: "active" | "non-active";
}) {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const baseButtonStyle = "rounded-full mx-auto my-auto h-6 w-6";
	const icon = {
		tabular: <Table2Icon className="h-4 w-4" />,
		uploaded_file: <FileUpIcon className="h-4 w-4" />,
		knowledge_base: <BookOpenCheckIcon className="h-4 w-4" />,
	};

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
						{icon[reference.source_type]}
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
					// refParentId={reference.location.parent_id}
					refSourceName={reference.source_name}
				/>
			) : null}
		</>
	);
});

function FileReferenceModal({
	onOpen,
	setOnOpen,
	refName,
	refSourceName,
}: {
	onOpen: boolean;
	setOnOpen: (open: boolean) => void;
	refName: string;
	refSourceName: string;
}) {
	// const { getChunk } = useFetchChunk();
	const { getPdf } = useFetchPdf();
	const [content, setContent] = useState<Blob | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const callAPI = async () => {
			setIsLoading(true);
			try {
				// const data = await getChunk(refParentId);
				const data = await getPdf(refSourceName);
				// setContent(data.content);
				setContent(data);
			} catch (error) {
				// setContent("FAILED TO RETRIEVE DATA");
			} finally {
				setIsLoading(false);
			}
		};
		if (refSourceName) {
			callAPI();
		}
	}, [getPdf, refSourceName]);

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
						{/* <ScrollArea className="h-full p-4">
							<ReactMarkdown
								rehypePlugins={[rehypeHighlight]}
								remarkPlugins={[remarkGfm]}
							>
								{content}
							</ReactMarkdown>
						</ScrollArea> */}
						<PDFViewer file={content as File} />
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

const UserFileReference = memo(function UserFileReference() {
	return null;
});

function UserFileReferenceModal({
	file,
	open,
	onOpenChange,
}: {
	file: File;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	// const [isLoading, setIsLoading] = useState<boolean>(false)
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex flex-col h-6/12 lg:h-10/12">
				<DialogTitle className="text-xl h-fit">{file.name}</DialogTitle>
				<div className="flex-1 flex">
					<PDFViewer file={file} />
				</div>
			</DialogContent>
		</Dialog>
	);
}

export { FileReference, UserFileReference, UserFileReferenceModal };

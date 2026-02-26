"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRef, useCallback } from "react";
import {
	useAppendInsertionFile,
	useGetInsertionFiles,
	useInsertion,
	useIsInsertionLoading,
	useRemoveInsertionFile,
	useResetInsertionFiles,
} from "@/hooks/useRag";
import { useAppendError } from "@/hooks/useError";
import { Spinner } from "@/components/ui/spinner";

const MAX_FILES = 10;

export default function KnowledgeUploadPage() {
	const files = useGetInsertionFiles();
	const isLoading = useIsInsertionLoading();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const hasLoadedRef = useRef(false);
	const insertion = useInsertion();
	const resetFiles = useResetInsertionFiles();
	const appendFile = useAppendInsertionFile();
	const removeFile = useRemoveInsertionFile();
	const appendError = useAppendError();

	const isLimitReached = files.length >= MAX_FILES;
	const remainingSlots = MAX_FILES - files.length;

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFiles = event.target.files;
			if (!selectedFiles || selectedFiles.length === 0) return;

			// Check if adding these files would exceed the limit
			if (files.length + selectedFiles.length > MAX_FILES) {
				appendError(
					`You can only upload up to ${MAX_FILES} files. Please remove some files first.`,
				);
				if (event.target) event.target.value = "";
				return;
			}

			appendFile(Array.from(selectedFiles));
			hasLoadedRef.current = true;

			// Reset input to allow selecting the same files again
			if (event.target) event.target.value = "";
		},
		[appendFile, files.length, appendError],
	);

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			if (isLimitReached) {
				appendError(
					`Maximum ${MAX_FILES} files allowed. Remove files to add more.`,
				);
				return;
			}

			const droppedFiles = event.dataTransfer.files;
			if (droppedFiles.length === 0) return;

			// Check limit
			if (files.length + droppedFiles.length > MAX_FILES) {
				appendError(
					`Cannot add ${droppedFiles.length} file(s). Only ${remainingSlots} slot(s) remaining.`,
				);
				return;
			}

			appendFile(Array.from(droppedFiles));
			hasLoadedRef.current = true;
		},
		[appendFile, files.length, isLimitReached, remainingSlots, appendError],
	);

	const removeFileHandler = useCallback(
		(index: number) => {
			removeFile(index);
		},
		[removeFile],
	);

	const handleUpload = async () => {
		if (files.length === 0) return;

		try {
			const result = await insertion(false, false);
			resetFiles();
		} catch (error) {
			console.error("Upload failed:", error);
			appendError(
				error instanceof Error ? error.message : "Failed to insert knowledge",
			);
		}
	};

	// Prevent click when limit reached
	const handleLabelClick = (e: React.MouseEvent) => {
		if (isLimitReached) {
			e.preventDefault();
			appendError(
				`Maximum ${MAX_FILES} files reached. Remove files to upload more.`,
			);
		}
	};

	return (
		<ScrollArea className="h-full">
			<div className="flex flex-col gap-4 py-4 w-xs md:w-lg lg:w-2xl xl:w-4xl mx-auto h-full">
				{/* Header Section */}
				<header className="flex flex-col rounded-lg p-4 gap-2 border">
					<div className="flex flex-row gap-2 items-center">
						<h1 className="text-2xl">Knowledge Base</h1>
					</div>
					<Separator orientation="horizontal" />
					<div className="text-sm text-muted-foreground">
						Upload documents to enrich the AI knowledge base
					</div>
				</header>

				<label
					htmlFor="file-upload-input"
					className={`flex rounded-lg border px-4 py-4 items-center transition-colors relative ${
						isLimitReached
							? "opacity-50 cursor-not-allowed bg-muted"
							: "cursor-pointer hover:bg-accent/50"
					}`}
					onDrop={handleDrop}
					onDragOver={(e) => {
						e.preventDefault();
						if (isLimitReached) {
							e.dataTransfer.dropEffect = "none";
						}
					}}
					onClick={handleLabelClick}
					onKeyDown={(e) => {
						if (isLimitReached && (e.key === "Enter" || e.key === " ")) {
							e.preventDefault();
							handleLabelClick(
								e as unknown as React.MouseEvent<HTMLLabelElement>,
							);
						}
					}}
					tabIndex={isLimitReached ? 0 : -1}
					aria-disabled={isLimitReached}
				>
					{isLimitReached && (
						<div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
							<span className="text-sm font-medium text-destructive">
								Limit reached ({MAX_FILES}/{MAX_FILES})
							</span>
						</div>
					)}

					<div className="flex flex-col w-full gap-y-2 pointer-events-none">
						<div className="flex justify-between items-center">
							<h1 className="text-lg">Upload Documents</h1>
							<span
								className={`text-xs font-medium ${isLimitReached ? "text-destructive" : "text-muted-foreground"}`}
							>
								{files.length}/{MAX_FILES} files
							</span>
						</div>

						<input
							id="file-upload-input"
							ref={fileInputRef}
							type="file"
							multiple
							className="hidden"
							onChange={handleFileSelect}
							accept=".pdf,.doc,.docx,.txt,.md"
							disabled={isLoading || isLimitReached}
						/>

						<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
							<Button
								type="button"
								variant="outline"
								disabled={isLoading || isLimitReached}
								tabIndex={-1}
							>
								{isLimitReached ? "Limit Reached" : "Select Files or Drag Here"}
							</Button>
							<p className="text-xs text-muted-foreground mt-2">
								{isLimitReached
									? `Remove files to upload more (max ${MAX_FILES})`
									: `Click to browse or drag and drop files (${remainingSlots} remaining)`}
							</p>
						</div>

						<p className="text-xs text-muted-foreground">
							Maximum 10MB per file. Supported: PDF, DOCX, TXT, MD.
						</p>
					</div>
				</label>

				<div className="flex flex-col p-4 rounded-lg border gap-2">
					<div className="flex justify-between items-center">
						<h1 className="text-lg">
							Selected Files
							<span
								className={`ml-2 text-sm ${isLimitReached ? "text-destructive font-bold" : "text-muted-foreground"}`}
							>
								({files.length}/{MAX_FILES})
							</span>
						</h1>
						{files.length > 0 && (
							<Button size="sm" onClick={handleUpload} disabled={isLoading}>
								{isLoading ? (
									<>
										<Spinner data-icon="inline-start" />
										"Uploading..."
									</>
								) : (
									`Upload All (${files.length})`
								)}
							</Button>
						)}
					</div>

					<div className="max-h-[400px] overflow-y-auto flex flex-col gap-2 pr-1">
						{files.length > 0 ? (
							files.map((file, index) => (
								<div
									key={`${file.name}-${index}`}
									className="flex justify-between items-center p-3 rounded-md border bg-card text-card-foreground"
								>
									<div className="flex flex-col min-w-0 flex-1">
										<span className="font-medium truncate">{file.name}</span>
										<span className="text-xs text-muted-foreground">
											{(file.size / 1024 / 1024).toFixed(2)} MB
										</span>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeFileHandler(index)}
										disabled={isLoading}
										className="shrink-0 ml-2"
									>
										Remove
									</Button>
								</div>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg">
								<p className="text-sm font-medium">No files selected</p>
								<p className="text-xs">Upload files to see them listed here</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}

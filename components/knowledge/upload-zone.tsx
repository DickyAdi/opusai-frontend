"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	useGetInsertionFiles,
	useHandleFileInsertionDrop,
	useHandleFileInsertionLabelClick,
	useHandleFileInsertionSelect,
	useInsertionIsLimit,
	useIsInsertionLoading,
} from "@/hooks/useRag";
import { MAX_FILES } from "@/lib/config/constants";

export function FileUploadZone() {
	const isLimitReached = useInsertionIsLimit();
	const isLoading = useIsInsertionLoading();
	const files = useGetInsertionFiles();
	const handleDrop = useHandleFileInsertionDrop();
	const handleLabelClick = useHandleFileInsertionLabelClick();
	const handleFileSelect = useHandleFileInsertionSelect();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const remainingSlots = MAX_FILES - files.length;

	return (
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
					handleLabelClick(e as unknown as React.MouseEvent<HTMLLabelElement>);
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
					<h2 className="text-lg">Upload Documents</h2>
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
	);
}

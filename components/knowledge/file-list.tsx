"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
	useGetInsertionFiles,
	useHandleFileInsertionRemove,
	useHandleFileInsertionUpload,
	useInsertionIsLimit,
	useIsInsertionLoading,
} from "@/hooks/useRag";
import { MAX_FILES } from "@/lib/config/constants";

export function FileListPanel() {
	const files = useGetInsertionFiles();
	const isLoading = useIsInsertionLoading();
	const isLimitReached = useInsertionIsLimit();
	const handleUpload = useHandleFileInsertionUpload();
	const removeFileHandler = useHandleFileInsertionRemove();

	return (
		<div className="flex flex-col p-4 rounded-lg border gap-2">
			<div className="flex justify-between items-center">
				<h2 className="text-lg">
					Selected Files
					<span
						className={`ml-2 text-sm ${isLimitReached ? "text-destructive font-bold" : "text-muted-foreground"}`}
					>
						({files.length}/{MAX_FILES})
					</span>
				</h2>
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
	);
}

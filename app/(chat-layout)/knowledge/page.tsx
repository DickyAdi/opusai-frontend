"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { KnowledgeHeader } from "@/components/knowledge/header";
import { FileUploadZone } from "@/components/knowledge/upload-zone";
import { FileListPanel } from "@/components/knowledge/file-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderCog2Icon, FolderInputIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { KnowledgeManagementTable } from "@/components/knowledge/knowledge-table";
import { useEffect } from "react";
import { useFetchKnowledges } from "@/hooks/useRag";

export default function KnowledgeUploadPage() {
	const fetchKnowledges = useFetchKnowledges();
	useEffect(() => {
		fetchKnowledges();
	}, [fetchKnowledges]);
	return (
		<div className="h-full flex flex-col px-8 py-4">
			<Tabs defaultValue="insert" className="flex-1 flex flex-col min-h-0">
				<TabsList variant="line">
					<TabsTrigger value="insert" className="text-md">
						<FolderInputIcon className="h-4 w-4" /> Insert
					</TabsTrigger>
					<TabsTrigger value="manage" className="text-md">
						<FolderCog2Icon className="h-4 w-4" /> Manage
					</TabsTrigger>
				</TabsList>
				<TabsContent value="insert" className="flex-1 overflow-hidden mt-0">
					<ScrollArea className="h-full">
						<div className="flex flex-col gap-4 py-4 w-xs md:w-lg lg:w-2xl xl:w-4xl mx-auto">
							<KnowledgeHeader />
							<FileUploadZone />
							<FileListPanel />
						</div>
					</ScrollArea>
				</TabsContent>
				<TabsContent value="manage" className="flex-1 overflow-hidden mt-0">
					<div className="flex flex-col gap-4 py-4 w-full mx-auto">
						<header className="flex flex-col rounded-lg p-4 gap-2 border shrink-0">
							<div className="flex flex-row gap-2 items-center">
								<h1 className="text-2xl">Available Knowledge Base</h1>
							</div>
							<Separator orientation="horizontal" />
							<div className="text-sm text-muted-foreground">
								See the available knowledge bases to be asked
							</div>
						</header>
						<div className="flex flex-col h-114 rounded-lg p-4 gap-2 border">
							<KnowledgeManagementTable />
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

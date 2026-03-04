import { Separator } from "@/components/ui/separator";

export function KnowledgeHeader() {
	return (
		<header className="flex flex-col rounded-lg p-4 gap-2 border">
			<div className="flex flex-row gap-2 items-center">
				<h1 className="text-2xl">Knowledge Base</h1>
			</div>
			<Separator orientation="horizontal" />
			<div className="text-sm text-muted-foreground">
				Upload documents to enrich the AI knowledge base
			</div>
		</header>
	);
}

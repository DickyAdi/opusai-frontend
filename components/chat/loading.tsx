import { Spinner } from "@/components/ui/spinner";
import { useThinkingStatus } from "@/hooks/useChat";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

export function ChatAIThinking() {
	const thinkingStatus = useThinkingStatus();
	return (
		<div className="flex gap-2 p-3 border rounded-xl">
			<Accordion
				type="single"
				collapsible
				// defaultValue="nested-status"
				className="w-full"
			>
				<AccordionItem value="nested-status">
					<AccordionTrigger>
						<Spinner className="h-4 w-4" />
						<p className="text-sm">AI is Thinking...</p>
					</AccordionTrigger>
					{thinkingStatus && (
						<AccordionContent className="flex flex-row gap-2 items-center">
							<Spinner className="h-4 w-4" />
							<p className="text-sm">{thinkingStatus}</p>
						</AccordionContent>
					)}
				</AccordionItem>
			</Accordion>
		</div>
	);
}

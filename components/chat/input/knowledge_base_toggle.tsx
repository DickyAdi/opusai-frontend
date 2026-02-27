import { Toggle } from "@/components/ui/toggle";
import { useIsThinking, useKnowledge, useSetKnowledge } from "@/hooks/useChat";
import { TextSearchIcon } from "lucide-react";
import { memo } from "react";

export const KnowledgeBaseInputToggle = memo(
	function KnowledgeBaseInputToggle() {
		const knowledge = useKnowledge();
		const setKnowledge = useSetKnowledge();
		const isThinking = useIsThinking();

		return (
			<Toggle
				aria-label="Toggle bookmark"
				size="sm"
				variant="default"
				className="text-xs p-1"
				disabled={isThinking}
				pressed={knowledge}
				onPressedChange={(pressed) => setKnowledge(pressed)}
			>
				<TextSearchIcon className="h-4 w-4" />
				Knowledge
			</Toggle>
		);
	},
);

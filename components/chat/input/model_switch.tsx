import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupButton } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
	useAvailableModels,
	useIsLoadingModels,
	useIsThinking,
	useSelectedModel,
	useSetSelectedModel,
} from "@/hooks/useChat";
import { ChevronDownIcon } from "lucide-react";
import { memo } from "react";

const ChatModelSwitch = memo(function ChatModelSwitch() {
	const isThinking = useIsThinking();
	const availableModels = useAvailableModels();
	const isLoadingModels = useIsLoadingModels();
	const selectedModel = useSelectedModel();
	const setSelectedModel = useSetSelectedModel();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<InputGroupButton
					id="selected-model"
					title="Change model"
					aria-label="Change model"
					disabled={isThinking}
					className="group"
				>
					<div className="flex items-center justify-start">
						<ChevronDownIcon className="size-3 transition-transform group-data-[state=open]:rotate-180" />
						{isLoadingModels ? (
							<Spinner className="size-4" />
						) : (
							<span className="text-xs pl-1.5">
								{selectedModel || "Choose model"}
							</span>
						)}
					</div>
				</InputGroupButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{availableModels.map((model) => (
					<DropdownMenuItem
						key={model.name}
						onClick={() => setSelectedModel(model.name)}
					>
						{model.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
});

export { ChatModelSwitch };

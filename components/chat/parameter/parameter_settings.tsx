import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParameterSettings } from "@/hooks/useChat";
import type { ChatParameterSettingsType } from "@/lib/type/chat_parameter";
import { useState } from "react";

export function ChatParameterPopover({
	open,
	onOpenChange,
	onSave,
	children,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: ({ temperature }: ChatParameterSettingsType) => void;
	children: React.ReactNode;
}) {
	const [temperature, setTemperature] = useState([0.7]);
	const parameter = useParameterSettings();

	const submit_handler = () => {
		onSave({ temperature: temperature[0] });
		onOpenChange(false);
	};

	const close_handler = () => {
		onOpenChange(false);
	};

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			{children}
			<PopoverContent
				className="flex flex-col gap-4 w-80 items-start"
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
			>
				<div className="flex flex-col w-full border rounded-lg p-2">
					<div className="flex flex-col gap-0.5">
						<Tooltip>
							<TooltipTrigger className="w-full">
								<div className="flex w-full justify-between">
									<p className="text-sm">Temperature</p>
									<p className="text-sm">{temperature}</p>
								</div>
							</TooltipTrigger>
							<TooltipContent className="text-wrap w-sm md:w-fit">
								<p>
									Controls AI deterministic output. Higher temperature will make
									AI be more expressive and lower is the opposite.
								</p>
							</TooltipContent>
						</Tooltip>
						<Slider
							defaultValue={[parameter.temperature]}
							value={temperature}
							onValueChange={setTemperature}
							step={0.1}
							max={1}
							min={0}
						/>
					</div>
				</div>
				<div className="flex flex-row gap-2 self-end">
					<Button size={"sm"} variant={"destructive"} onClick={close_handler}>
						Cancel
					</Button>
					<Button size={"sm"} onClick={submit_handler} className="self-end">
						Save
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircleIcon } from "lucide-react";

export default function SearchPage() {
	return (
		<div className="flex flex-col gap-4 py-4 w-xs md:w-lg lg:w-2xl xl:w-4xl mx-auto h-screen">
			<header className="flex flex-col rounded-lg p-4 gap-2 border h-[calc(30%-1rem)]">
				<div className="flex flex-row gap-2 items-center">
					<h1 className="text-2xl">Search</h1>
					<Tooltip>
						<TooltipTrigger asChild>
							{/* <Butto variant="outline">Hover</Button> */}
							<HelpCircleIcon className="h-4 w-4" />
						</TooltipTrigger>
						<TooltipContent>
							<p>
								Supposedly guideline of how to use the search, later will change
								to shadcn dialog
							</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<Separator orientation="horizontal" />
			</header>
			<div className="flex rounded-lg border p-4 h-[calc(10%-1rem)]">
				input box here
			</div>
			<div className="flex p-4 rounded-lg border h-[calc(55%-1rem)]">
				search result here
			</div>
		</div>
	);
}

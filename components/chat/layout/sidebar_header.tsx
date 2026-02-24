import { SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, SquareArrowOutUpRightIcon, Search } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useCreateNewConversation } from "@/hooks/useCreateNewConversation";
import { useTheme } from "@/hooks/useTheme";
import { useMemo } from "react";

export default function ChatSidebarHeader() {
	const newChatHandler = useCreateNewConversation();
	const theme = useTheme();
	const imageLogo = useMemo(() => {
		if (["dark", "monokai", "nord", "dracula"].includes(theme)) {
			return (
				<Image
					src={"/dark-logo.png"}
					width={240}
					height={60}
					className="p-0.5"
					alt="KartikaAI"
				/>
			);
		}
		return (
			<Image
				src={"/light-logo.png"}
				width={240}
				height={60}
				className="p-0.5"
				alt="KartikaAI"
			/>
		);
	}, [theme]);

	return (
		<SidebarHeader>
			<ul className="flex flex-col gap-2 pt-2 py-2 pb-1">
				<li className="text-lg font-semibold">
					<div className="grid grid-cols-2 mb-2">
						<div className="justify-self-start">
							<Link href={"/"}>
								<div className="flex flex-row gap-2">
									<div>{imageLogo}</div>
								</div>
							</Link>
						</div>
					</div>
				</li>
				<li>
					<Button
						className="w-full text-md justify-start cursor-pointer"
						variant="default"
						onClick={newChatHandler}
					>
						<SquareArrowOutUpRightIcon className="h-4 w-4" />
						New chat
					</Button>
					<Separator orientation={"horizontal"} className="my-2" />
					<Link href="/settings/general">
						<Button
							className="w-full text-md justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							variant="ghost"
						>
							<Settings className="h-4 w-4 p-0" />
							Settings
						</Button>
					</Link>
					{/* Commented out for stripped down version */}
					{/* <Link href="/search">
						<Button
							className="w-full text-md justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							variant="ghost"
						>
							<Search className="h-4 w-4 p-0" />
							Smart file search
						</Button>
					</Link> */}
				</li>
			</ul>
		</SidebarHeader>
	);
}

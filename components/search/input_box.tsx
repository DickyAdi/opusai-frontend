import { SearchIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { useGetIsSearching, useSmartSearch } from "@/hooks/useSmartsearch";
import { useRef, useState, KeyboardEvent } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Spinner } from "../ui/spinner";

export function SearchInputBox() {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);
	const search = useSmartSearch();
	const isSearching = useGetIsSearching();
	const queryRef = useRef("");

	function handle_search() {
		if (!query || isSearching) return;

		queryRef.current = "";

		queryRef.current = query;
		setQuery("");
		search(queryRef.current);
	}

	async function prevent_default_enter(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handle_search();
		}
	}

	return (
		<InputGroup className="flex-1">
			<InputGroupInput
				placeholder="Type in your language to search..."
				onKeyDown={prevent_default_enter}
				onChange={(e) => setQuery(e.target.value)}
				disabled={isSearching}
				className="md:text-base text-xs"
			/>
			<InputGroupAddon align={"inline-end"}>
				<InputGroupButton
					variant={"ghost"}
					size={"icon-sm"}
					onClick={handle_search}
					disabled={debouncedQuery === "" || isSearching}
				>
					{isSearching ? <Spinner /> : <SearchIcon />}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
}

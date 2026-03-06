"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	type Table,
	useReactTable,
	type Column,
	flexRender,
	RowSelectionState,
} from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowUp,
	ChevronsUpDown,
	EyeOff,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Table as UITable,
} from "./table";
import useDebounce from "@/hooks/useDebounce";
import { Spinner } from "./spinner";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
	enableSort?: boolean;
}

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

interface DataTableSearchInputProps<TData> {
	placeholder: string;
	// Client-side only (optional for server-side)
	table?: Table<TData>;
	searchColumn?: string;
	// Server-side only (optional for client-side)
	serverSideSearch?: boolean;
	searchQuery?: string;
	setSearchQuery?: (query: string) => void;
	isSearching?: boolean;
}

interface ComponentDataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	enablePagination?: boolean;
	cursorBasedPagination?: boolean;
	cursorConfig?: CursorPaginationConfig | null;
	enableSearch?: boolean;
	enableSorting?: boolean;
	enableSelect?: boolean;
	searchColumn?: string;
	searchPlaceholder?: string;
	pageSize?: number;
	pageSizeOptions?: number[];
	className?: string;
	size?: "sm" | "md" | "lg";
}

interface CursorPaginationConfig {
	hasNext: boolean;
	hasPrevious: boolean;
	onNext: () => void;
	onPrevious: () => void;
	onPageSizeChange?: (pageSize: number) => void;
	isLoading?: boolean;
	count?: number;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
	enableSort = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort() || !enableSort) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="data-[state=open]:bg-accent -ml-3 h-8"
					>
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDown />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUp />
						) : (
							<ChevronsUpDown />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUp />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDown />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOff />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

// export function DataTableSearchInput<TData>({
// 	table,
// 	placeholder,
// 	searchColumn,
// }: {
// 	table: Table<TData>;
// 	placeholder: string;
// 	searchColumn: string;
// }) {
// 	return (
// 		<div className="flex items-center shrink-0">
// 			<Input
// 				placeholder={placeholder}
// 				value={
// 					(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
// 				}
// 				onChange={(event) =>
// 					table.getColumn(searchColumn)?.setFilterValue(event.target.value)
// 				}
// 				className="max-w-sm"
// 			/>
// 		</div>
// 	);
// }

export function DataTableSearchInput<TData>({
	table,
	placeholder,
	searchColumn,
	serverSideSearch = false,
	searchQuery,
	setSearchQuery,
	isSearching,
}: DataTableSearchInputProps<TData>) {
	const id = crypto.randomUUID();

	// Client-side: use TanStack Table's built-in filtering
	if (!serverSideSearch) {
		// Safety check for required client-side props
		if (!table) {
			console.error(
				"DataTableSearchInput: 'table' is required for client-side search",
			);
			return null;
		}

		if (!searchColumn) {
			console.error(
				"DataTableSearchInput: 'searchColumn' is required for client-side search",
			);
			return null;
		}

		return (
			<div className="flex items-center shrink-0">
				<Input
					id={`client-search-${id}`}
					placeholder={placeholder}
					value={
						(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn(searchColumn)?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
		);
	}

	// Server-side: controlled input with loading state
	if (!setSearchQuery) {
		console.warn(
			"DataTableSearchInput: 'setSearchQuery' is required for server-side search",
		);
		return null;
	}

	return (
		<div className="flex items-center shrink-0 gap-2">
			<Input
				id={`server-search-${id}`}
				placeholder={placeholder}
				value={searchQuery ?? ""}
				onChange={(event) => setSearchQuery(event.target.value)}
				className="max-w-sm"
			/>
			{isSearching && (
				<Spinner className="h-4 w-4 text-muted-foreground animate-spin" />
			)}
		</div>
	);
}

export function DataTablePagination<TData>({
	table,
	enableSelect,
	pageSize,
	pageSizeOptions,
	cursorConfig = null,
	cursorBased = false,
}: {
	table: DataTablePaginationProps<TData>["table"];
	enableSelect: boolean;
	pageSize: number;
	pageSizeOptions: number[];
	cursorBased?: boolean;
	cursorConfig?: CursorPaginationConfig | null;
}) {
	const canGoPrevious = cursorBased
		? (cursorConfig?.hasPrevious ?? false)
		: table.getCanPreviousPage();
	const canGoNext = cursorBased
		? (cursorConfig?.hasNext ?? false)
		: table.getCanNextPage();
	const isLoading = cursorBased ? (cursorConfig?.isLoading ?? false) : false;
	const handlePageSizeChange = (value: string) => {
		console.log(`Printing value ${value}`);
		const newSize = Number(value);
		console.log(`printing newSize ${newSize}`);
		if (cursorBased && cursorConfig?.onPageSizeChange) {
			cursorConfig.onPageSizeChange(newSize);
		} else {
			table.setPageSize(newSize);
		}
	};

	return (
		<div className="flex items-center justify-between px-2 shrink-0">
			{enableSelect && (
				<div className="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
			)}
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={handlePageSizeChange}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{pageSizeOptions.map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="flex">
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					{cursorBased ? (
						<span>
							{cursorConfig?.count ?? table.getRowModel().rows.length} items
						</span>
					) : (
						<span>
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</span>
					)}
				</div>
				<div className="flex items-center space-x-2">
					{!cursorBased && (
						<Button
							variant={"outline"}
							size={"icon"}
							className="hidden size-8 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!canGoPrevious || isLoading}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft className="size-4" />
						</Button>
					)}
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => {
							if (cursorBased && cursorConfig) {
								cursorConfig.onPrevious();
							} else {
								table.previousPage();
							}
						}}
						disabled={!canGoPrevious || isLoading}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => {
							if (cursorBased && cursorConfig) {
								cursorConfig.onNext();
							} else {
								table.nextPage();
							}
						}}
						disabled={!canGoNext || isLoading}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>

					{!cursorBased && (
						<Button
							variant="outline"
							size="icon"
							className="hidden size-8 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!canGoNext || isLoading}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

// export function ComponentDataTable<TData, TValue>({
// 	columns,
// 	data,
// 	enablePagination = false,
// 	cursorBasedPagination = false,
// 	cursorConfig = null,
// 	enableSearch = false,
// 	enableSorting = false,
// 	enableSelect = false,
// 	searchColumn = "",
// 	searchPlaceholder = "",
// 	pageSize = 10,
// 	pageSizeOptions = [10, 20, 30, 40, 50],
// 	className = "",
// 	size = "md",
// }: ComponentDataTableProps<TData, TValue>) {
// 	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
// 	const [sorting, setIsSorting] = useState<SortingState>([]);
// 	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
// 	const table = useReactTable({
// 		data,
// 		columns,
// 		getCoreRowModel: getCoreRowModel(),
// 		...(enablePagination && {
// 			getPaginationRowModel: getPaginationRowModel(),
// 			initialState: {
// 				pagination: {
// 					pageSize: pageSize,
// 				},
// 			},
// 		}),
// 		...(cursorBasedPagination && {
// 			manualPagination: true,
// 		}),
// 		...(enableSorting && {
// 			getSortedRowModel: getSortedRowModel(),
// 			onColumnFiltersChange: setColumnFilters,
// 			onSortingChange: setIsSorting,
// 		}),
// 		...(enableSearch && {
// 			getFilteredRowModel: getFilteredRowModel(),
// 			onColumnFiltersChange: setColumnFilters,
// 		}),
// 		...(enableSelect && {
// 			onRowSelectionChange: setRowSelection,
// 		}),
// 		state: {
// 			...(enableSorting && { sorting }),
// 			...(enableSearch && { columnFilters }),
// 			...(enableSelect && { rowSelection }),
// 		},
// 	});

// 	return (
// 		// <div className={cn("flex flex-col gap-2 h-full", className)}>
// 		<div className={cn("flex flex-col gap-2 h-full min-h-0", className)}>
// 			{enableSearch && (
// 				<DataTableSearchInput
// 					table={table}
// 					searchColumn={searchColumn}
// 					placeholder={searchPlaceholder}
// 				/>
// 			)}
// 			<div className="flex-1 min-h-0 border rounded-md">
// 				<ScrollArea className="h-full">
// 					<UITable noWrapper size={size}>
// 						<TableHeader className="sticky top-0 bg-background z-10">
// 							{table.getHeaderGroups().map((headerGroup) => (
// 								<TableRow key={headerGroup.id}>
// 									{headerGroup.headers.map((header) => {
// 										return (
// 											<TableHead key={header.id}>
// 												{header.isPlaceholder
// 													? null
// 													: flexRender(
// 															header.column.columnDef.header,
// 															header.getContext(),
// 														)}
// 											</TableHead>
// 										);
// 									})}
// 								</TableRow>
// 							))}
// 						</TableHeader>
// 						<TableBody>
// 							{table.getRowModel().rows?.length ? (
// 								table.getRowModel().rows.map((row) => (
// 									<TableRow
// 										key={row.id}
// 										data-state={row.getIsSelected() && "selected"}
// 									>
// 										{row.getVisibleCells().map((cell) => (
// 											<TableCell key={cell.id}>
// 												{flexRender(
// 													cell.column.columnDef.cell,
// 													cell.getContext(),
// 												)}
// 											</TableCell>
// 										))}
// 									</TableRow>
// 								))
// 							) : (
// 								<TableRow>
// 									<TableCell
// 										colSpan={columns.length}
// 										className="h-24 text-center"
// 									>
// 										No results.
// 									</TableCell>
// 								</TableRow>
// 							)}
// 						</TableBody>
// 					</UITable>
// 				</ScrollArea>
// 			</div>
// 			{enablePagination && (
// 				<DataTablePagination
// 					table={table}
// 					enableSelect={enableSelect}
// 					pageSize={pageSize}
// 					pageSizeOptions={pageSizeOptions}
// 					cursorBased={cursorBasedPagination}
// 					cursorConfig={cursorConfig}
// 				/>
// 			)}
// 		</div>
// 	);
// }

export function ComponentDataTable<TData, TValue>({
	columns,
	data,
	enablePagination = false,
	cursorBasedPagination = false,
	cursorConfig = null,
	enableSearch = false,
	serverSideSearch = false, // NEW: Toggle between client/server search
	onSearch, // NEW: Callback for server-side search
	isSearching = false, // NEW: Loading state for server search
	enableSorting = false,
	enableSelect = false,
	searchColumn = "",
	searchPlaceholder = "",
	pageSize = 10,
	pageSizeOptions = [10, 20, 30, 40, 50],
	className = "",
	size = "md",
}: ComponentDataTableProps<TData, TValue> & {
	serverSideSearch?: boolean;
	onSearch?: (query: string) => void;
	isSearching?: boolean;
}) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setIsSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	// NEW: Internal search state for server-side mode
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearch = useDebounce(searchQuery, 300);

	// NEW: Trigger server search when debounced value changes
	useEffect(() => {
		if (serverSideSearch && onSearch) {
			onSearch(debouncedSearch);
		}
	}, [debouncedSearch, serverSideSearch, onSearch]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		...(enablePagination &&
			!cursorBasedPagination && {
				getPaginationRowModel: getPaginationRowModel(),
				initialState: {
					pagination: {
						pageSize: pageSize,
					},
				},
			}),
		...(cursorBasedPagination && {
			manualPagination: true,
		}),
		...(enableSorting && {
			getSortedRowModel: getSortedRowModel(),
			onSortingChange: setIsSorting,
		}),
		// MODIFIED: Only enable client-side filtering if NOT server-side
		...(enableSearch &&
			!serverSideSearch && {
				getFilteredRowModel: getFilteredRowModel(),
				onColumnFiltersChange: setColumnFilters,
			}),
		...(enableSelect && {
			onRowSelectionChange: setRowSelection,
		}),
		state: {
			...(enableSorting && { sorting }),
			...(enableSearch && !serverSideSearch && { columnFilters }),
			...(enableSelect && { rowSelection }),
		},
	});

	return (
		<div className={cn("flex flex-col gap-2 h-full min-h-0", className)}>
			{enableSearch && (
				<DataTableSearchInput
					table={table}
					searchColumn={searchColumn}
					placeholder={searchPlaceholder}
					serverSideSearch={serverSideSearch}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					isSearching={isSearching}
				/>
			)}
			<div className="flex-1 min-h-0 border rounded-md">
				<ScrollArea className="h-full">
					<UITable noWrapper size={size}>
						<TableHeader className="sticky top-0 bg-background z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</UITable>
				</ScrollArea>
			</div>
			{enablePagination && (
				<DataTablePagination
					table={table}
					enableSelect={enableSelect}
					pageSize={pageSize}
					pageSizeOptions={pageSizeOptions}
					cursorBased={cursorBasedPagination}
					cursorConfig={cursorConfig}
				/>
			)}
		</div>
	);
}

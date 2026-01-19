"use client"

import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, type Table, useReactTable, type Column, flexRender, RowSelectionState } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff,  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UITable } from "./table"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string,
  enableSort?: boolean
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

interface ComponentDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  enablePagination?:boolean,
  enableSearch?:boolean,
  enableSorting?:boolean,
  enableSelect?:boolean,
  searchColumn?:string,
  searchPlaceholder?:'',
  pageSize?:number,
  pageSizeOptions?:number[],
  className?:string
  size?: "sm" | "md" | "lg"
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  enableSort=false
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() || !enableSort) {
    return <div className={cn(className)}>{title}</div>
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
  )
}

export function DataTableSearchInput<TData>({table, placeholder, searchColumn}: {table:Table<TData>, placeholder:string, searchColumn:string}) {
  return (
    <div className="flex items-center shrink-0">
      <Input
        placeholder={placeholder}
        value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(searchColumn)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  )
}

export function DataTablePagination<TData>({
  table, enableSelect, pageSize, pageSizeOptions
}: {table:DataTablePaginationProps<TData>['table'], enableSelect:boolean, pageSize:number, pageSizeOptions:number[]}) {
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
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
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
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ComponentDataTable<TData, TValue>({
  columns,
  data,
  enablePagination=false,
  enableSearch=false,
  enableSorting=false,
  enableSelect=false,
  searchColumn='',
  searchPlaceholder='',
  pageSize=10,
  pageSizeOptions=[10,20,30,40,50],
  className='',
  size="md"
}: ComponentDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setIsSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize: pageSize
        }
      }
    }),
    ...(enableSorting && {
      getSortedRowModel:getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      onSortingChange:setIsSorting,
    }),
    ...(enableSearch && {
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters
    }),
    ...(enableSelect && {
      onRowSelectionChange: setRowSelection,
    }),
    state: {
      ...(enableSorting && { sorting }),
      ...(enableSearch && { columnFilters }),
      ...(enableSelect && { rowSelection })
    }
  })
  
  return (
    <div className={cn('flex flex-col gap-2 flex-1 min-h-32', className)}>
      {enableSearch && <DataTableSearchInput table={table} searchColumn={searchColumn} placeholder={searchPlaceholder}/>}
      <ScrollArea className="relative w-full flex-1 min-h-0 border rounded-md">
        <UITable noWrapper size={size}>
          <TableHeader className="sticky top-0 bg-background z-10">
            {
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {
                    headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {
                            header.isPlaceholder ?
                            null
                            :
                            flexRender(header.column.columnDef.header, header.getContext())
                          }
                        </TableHead>
                      )
                    })
                  }
                </TableRow>
              ))
            }
          </TableHeader>
          <TableBody>
            {
              table.getRowModel().rows?.length ? 
              (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {
                      row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </UITable>
      </ScrollArea>
      {enablePagination && <DataTablePagination table={table} enableSelect={enableSelect} pageSize={pageSize} pageSizeOptions={pageSizeOptions}/>}
    </div>
  )
}
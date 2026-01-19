"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const tableCellVariants = cva('p-4 align-middle', {
  variants: {
    size: {
      sm: "p-2 text-xs",
      md: "p-4 text-sm",
      lg: "p-6 text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const TableContext = React.createContext<{size?: "sm" | "md" | "lg"}>({size:"md"})

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & 
  VariantProps<typeof tableVariants> & {
    noWrapper?: boolean;
    divClassname?: string;
  }
>(({ className, noWrapper, divClassname, size, ...props }, ref) => {
  if (noWrapper) {
    return (
      <TableContext.Provider value={{ size:size ?? 'md' }}>
        <table
          ref={ref}
          className={cn(tableVariants({size}), className)}
          {...props}
        />
      </TableContext.Provider>
    );
  }
  
  return (
    <div className={cn("relative w-full overflow-auto", divClassname)}>
      <table
        ref={ref}
        className={cn(tableVariants({size}), className)}
        {...props}
      />
    </div>
  );
})
Table.displayName = "Table"

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  const { size }  = React.useContext(TableContext)
  
  return (
    <thead
      data-slot="table-header"
      // className={cn("[&_tr]:border-b", className)}
      className={cn(tableCellVariants({ size }), "[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  const { size } = React.useContext(TableContext)
  
  return (
    <th
      data-slot="table-head"
      className={cn(tableCellVariants({size}),
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

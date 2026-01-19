"use client"

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/type/user";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Knowledge } from "@/lib/type/knowledge";
import { ModelType } from "@/lib/type/model";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "role",
    header: "Role",
  }
]

export const knowledgeColumns: ColumnDef<Knowledge>[] = [
  {
    accessorKey:'name',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Name"/>
    )
  },
  {
    accessorKey:'type',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Type"/>
    )
  }
]

export const modelColumns: ColumnDef<ModelType>[] = [
  {
    accessorKey:'name',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Model"/>
    )
  }
]
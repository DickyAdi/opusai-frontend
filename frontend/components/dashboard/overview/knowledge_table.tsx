import { ComponentDataTable } from "@/components/ui/data-table";
import { dummyKnowledge } from "@/lib/type/knowledge";
import { useMemo } from "react";
import { knowledgeColumns } from "./columns";

export default function KnowledgeOverviewTable() {
  const data = useMemo(() => (dummyKnowledge), [])
  const columns = knowledgeColumns
  return (
    <ComponentDataTable data={data} columns={columns} size="sm"/>
  )
}
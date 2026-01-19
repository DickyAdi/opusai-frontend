'use client'

import { ComponentDataTable } from "@/components/ui/data-table";
import { useAvailableModels, useFetchModels, useIsLoadingModels } from "@/hooks/useChat";
import { useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { modelColumns } from "./columns";

export default function ModelOverviewTable() {
  useFetchModels()
  const availableModels = useAvailableModels()
  const isLoadingModels = useIsLoadingModels()
  const data = useMemo(() => availableModels, [availableModels])

  return (
    <>
      {
        isLoadingModels ? <Spinner /> : <ComponentDataTable data={data} columns={modelColumns} size="sm"/>
      }
    </>
  )
}
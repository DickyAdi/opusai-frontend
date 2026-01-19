import { columns } from "@/components/dashboard/overview/columns";
import { Datatable } from "@/components/dashboard/overview/dataTable";
import KnowledgeOverviewTable from "@/components/dashboard/overview/knowledge_table";
import ModelOverviewTable from "@/components/dashboard/overview/model_table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import DotBlink from "@/components/utils/dot_blink";
import { DummyUser } from "@/lib/type/user";
import { BookOpenTextIcon, BotIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";



export default function DashboardOverviewPage() {
  const userData = useMemo(() => DummyUser, [])
  return (
    <div className="flex flex-col p-4 gap-4">
      <header className="flex gap-6 p-4 rounded-2xl border">

        <Card className="py-6 px-0 flex-1 border-0">
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <h4 className="text-base font-semibold">Accounts</h4>
              <UserIcon className="h-6 w-6"/>
            </div>
            <h2>123</h2>
          </CardContent>
        </Card>

        <Card className="py-6 px-0 flex-1 border-0">
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-base font-semibold">AI Status</h1>
              <BotIcon className="h-6 w-6"/>
            </div>
            <div className="flex flex-row gap-3">
              <div className="flex flex-row items-center gap-3">
                <h2>5 Online</h2>
                <DotBlink variant="online" className="h-2 w-2"/>
              </div>
              <Separator orientation="vertical"/>
              <div className="flex flex-row gap-3 items-center">
                <h2>0 Offline</h2>
                <DotBlink variant="offline" className="h-2 w-2"/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-6 px-0 flex-1 border-0">
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-base font-semibold">Knowledge</h1>
              <BookOpenTextIcon className="h-6 w-6"/>
            </div>
            <h2>242 Documents</h2>
          </CardContent>
        </Card>
      </header>

      <main className="grid grid-cols-12 p-4 border rounded-2xl gap-4">
        <div className="grid col-span-12 grid-cols-12 gap-4">
          <div className="col-span-8 rounded-2xl p-4 min-h-96 bg-card text-card-foreground">
            <div className="h-96 flex flex-col gap-2">
              <h1 className="text-base p-1">User account</h1>
              <Datatable columns={columns} data={userData}/>
            </div>
          </div>
          <div className="col-span-4 rounded-2xl p-4 min-h-96 bg-card text-card-foreground">
            <div className="flex flex-col flex-1 gap-4">
              <div className="flex flex-col border h-48 gap-2 p-2 rounded-lg">
                <h1 className="text-sm">AI Knowledge</h1>
                <KnowledgeOverviewTable />
              </div>
              <div className="flex flex-col border h-48 gap-2 p-2 rounded-lg">
                <h1 className="text-sm">Available models</h1>
                <ModelOverviewTable />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
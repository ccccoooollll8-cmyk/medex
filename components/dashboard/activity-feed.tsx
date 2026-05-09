import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MOCK_ACTIVITY_LOGS } from "@/lib/mock-data"
import { formatDateTime, getRoleColor, cn } from "@/lib/utils"

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-500",
  UPDATE: "bg-blue-500",
  DELETE: "bg-red-500",
  DISPATCH: "bg-indigo-500",
  ACCEPT: "bg-emerald-500",
  REJECT: "bg-red-500",
  TRANSFER: "bg-purple-500",
  VERIFY: "bg-cyan-500",
  RECEIVE: "bg-teal-500",
  VIEW: "bg-gray-400",
}

export function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const logs = MOCK_ACTIVITY_LOGS.slice(0, limit)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-3 pr-3">
            {logs.map((log, idx) => (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", ACTION_COLORS[log.action] || "bg-gray-400")} />
                  {idx < logs.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="pb-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold">{log.userName}</span>
                    <Badge variant="outline" className={cn("text-[10px] h-4 px-1.5", getRoleColor(log.userRole))}>
                      {log.userRole}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      {log.action}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDateTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

import { GitBranch } from "lucide-react"
import { TraceabilityView } from "@/components/traceability/traceability-view"

export default function AdminTraceabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Full Traceability</h1>
          <p className="text-muted-foreground text-sm">Complete platform-wide product movement audit trail</p>
        </div>
      </div>
      <TraceabilityView />
    </div>
  )
}

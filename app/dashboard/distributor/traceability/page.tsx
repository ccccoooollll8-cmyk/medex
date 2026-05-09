import { GitBranch } from "lucide-react"
import { TraceabilityView } from "@/components/traceability/traceability-view"

export default function DistributorTraceabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Chain of Custody</h1>
          <p className="text-muted-foreground text-sm">View product movement history and verify authenticity</p>
        </div>
      </div>
      <TraceabilityView />
    </div>
  )
}

import { GitBranch } from "lucide-react"
import { TraceabilityView } from "@/components/traceability/traceability-view"

export default function SupplierTraceabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Product Traceability</h1>
          <p className="text-muted-foreground text-sm">Track product movements from your facility through the supply chain</p>
        </div>
      </div>
      <TraceabilityView />
    </div>
  )
}

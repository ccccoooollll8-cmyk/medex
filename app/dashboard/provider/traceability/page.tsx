import { Shield } from "lucide-react"
import { TraceabilityView } from "@/components/traceability/traceability-view"

export default function ProviderTraceabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Verify Products</h1>
          <p className="text-muted-foreground text-sm">Verify product authenticity and view complete supply chain history</p>
        </div>
      </div>
      <TraceabilityView />
    </div>
  )
}

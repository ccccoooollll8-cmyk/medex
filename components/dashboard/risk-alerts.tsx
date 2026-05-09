"use client"

import { AlertTriangle, Brain, TrendingDown, Clock, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_RISK_ALERTS } from "@/lib/mock-data"
import { cn, getRiskColor, formatDate } from "@/lib/utils"
import type { SupplyRiskAlert } from "@/lib/types"

const RISK_ICONS = {
  stock_depletion: TrendingDown,
  expiry: Clock,
  supplier_delay: AlertTriangle,
  demand_spike: Zap,
}

const RISK_LABELS = {
  stock_depletion: "Stock Depletion",
  expiry: "Expiry Risk",
  supplier_delay: "Supplier Delay",
  demand_spike: "Demand Spike",
}

export function RiskAlertsWidget() {
  const alerts = MOCK_RISK_ALERTS.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return order[a.riskLevel] - order[b.riskLevel]
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">AI Supply Risk Alerts</CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs">
            {alerts.filter((a) => a.riskLevel === "critical").length} Critical
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Predictive intelligence updated 6 min ago
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <RiskAlertItem key={alert.id} alert={alert} />
        ))}
      </CardContent>
    </Card>
  )
}

function RiskAlertItem({ alert }: { alert: SupplyRiskAlert }) {
  const Icon = RISK_ICONS[alert.riskType]

  return (
    <div className={cn("rounded-lg border p-3 space-y-2", getRiskColor(alert.riskLevel))}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold">{alert.productName}</p>
            <p className="text-xs opacity-80">{RISK_LABELS[alert.riskType]}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn("text-[10px] h-4 px-1.5 capitalize border-current shrink-0")}
        >
          {alert.riskLevel}
        </Badge>
      </div>
      <p className="text-xs opacity-80 leading-relaxed">{alert.message}</p>
      <div className="flex items-center justify-between pt-1">
        <p className="text-[10px] font-medium opacity-70">
          {alert.daysUntilCritical <= 7
            ? `Critical in ${alert.daysUntilCritical} days`
            : `Monitor in ${alert.daysUntilCritical} days`}
        </p>
      </div>
      <p className="text-[10px] italic opacity-70 border-t border-current/20 pt-2">
        Recommendation: {alert.recommendation}
      </p>
    </div>
  )
}

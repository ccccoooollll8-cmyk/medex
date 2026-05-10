"use client"

import { Activity, AlertTriangle, CheckCircle2, Package, Shield, Truck } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RiskAlertsWidget } from "@/components/dashboard/risk-alerts"
import { CategoryPieChart } from "@/components/dashboard/category-chart"
import { formatNumber, formatDate, getStatusColor, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useShipmentStore, useInventoryStore, useAuthStore } from "@/lib/store"

export default function ProviderDashboard() {
  const { user } = useAuthStore()
  const { shipments } = useShipmentStore()
  const { inventory } = useInventoryStore()

  const receivedInventory = inventory[user?.id ?? "user-003"] ?? []
  const incomingShipments = shipments.filter(
    (s) => s.toRole === "provider" && (s.status === "in_transit" || s.status === "dispatched")
  )
  const verifiedCount = shipments.filter((s) => s.toRole === "provider" && s.verified).length
  const lowStockAlerts = receivedInventory.filter((item) => item.quantity < 10).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">City General Hospital · Monitor your medical supplies and incoming orders</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Inventory"
          value={formatNumber(receivedInventory.length)}
          icon={Package}
          iconColor="text-green-500"
          iconBg="bg-green-50 dark:bg-green-950/30"
          subtitle="product lines stocked"
        />
        <KPICard
          title="Incoming Shipments"
          value={incomingShipments.length}
          icon={Truck}
          iconColor="text-blue-500"
          iconBg="bg-blue-50 dark:bg-blue-950/30"
          subtitle="expected deliveries"
        />
        <KPICard
          title="Verified Transactions"
          value={verifiedCount}
          icon={Shield}
          iconColor="text-cyan-500"
          iconBg="bg-cyan-50 dark:bg-cyan-950/30"
          trend={{ value: 5.2, label: "vs last month" }}
        />
        <KPICard
          title="Low Stock Alerts"
          value={lowStockAlerts}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/30"
          subtitle="critical items"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incoming Shipments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Incoming Shipments</CardTitle>
                </div>
                <Badge variant="info">{incomingShipments.length} incoming</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {incomingShipments.map((s) => (
                <div key={s.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono font-semibold text-primary">{s.shipmentNumber}</p>
                      {s.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">From: {s.fromName}</p>
                    <p className="text-xs mt-1">{s.products.map((p) => p.productName).join(", ")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className={cn("text-xs capitalize mb-1", getStatusColor(s.status))}>
                      {s.status.replace("_", " ")}
                    </Badge>
                    <p className="text-xs text-muted-foreground">ETA: {formatDate(s.estimatedArrival)}</p>
                  </div>
                </div>
              ))}
              {incomingShipments.length === 0 && (
                <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  No incoming shipments
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <CategoryPieChart />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskAlertsWidget />
        <ActivityFeed limit={6} />
      </div>
    </div>
  )
}

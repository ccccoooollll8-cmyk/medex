"use client"

import { Box, CheckCircle2, Package, Truck, TrendingUp, AlertTriangle } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ShipmentTracker } from "@/components/dashboard/shipment-tracker"
import { ShipmentPerformanceChart } from "@/components/dashboard/shipment-chart"
import { KPI_BY_ROLE } from "@/lib/mock-data"
import { formatNumber, getStatusColor, formatDate, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskAlertsWidget } from "@/components/dashboard/risk-alerts"
import { useShipmentStore, useInventoryStore, useAuthStore } from "@/lib/store"

export default function DistributorDashboard() {
  const kpi = KPI_BY_ROLE.distributor
  const { user } = useAuthStore()
  const { shipments } = useShipmentStore()
  const { inventory } = useInventoryStore()

  const receivedInventory = inventory[user?.id ?? "user-002"] ?? []
  const roleShipments = shipments.filter((s) => s.fromRole === "distributor" || s.toRole === "distributor")
  const pendingShipments = roleShipments.filter(
    (s) => s.toRole === "distributor" && (s.status === "pending" || s.status === "dispatched")
  )
  const inTransit = roleShipments.filter((s) => s.status === "in_transit")
  const activeShipments = roleShipments.filter((s) => !["accepted", "rejected"].includes(s.status))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Distributor Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">MedDistribute Inc. · Manage warehouse stock and transfers</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Warehouse SKUs"
          value={formatNumber(receivedInventory.length)}
          icon={Box}
          iconColor="text-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/30"
          subtitle="product lines in stock"
        />
        <KPICard
          title="Active Shipments"
          value={activeShipments.length}
          icon={Truck}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-950/30"
          subtitle={`${inTransit.length} in transit`}
        />
        <KPICard
          title="On-Time Rate"
          value={`${kpi.onTimeDeliveryRate}%`}
          icon={TrendingUp}
          iconColor="text-green-500"
          iconBg="bg-green-50 dark:bg-green-950/30"
          trend={{ value: 2.1, label: "vs last month" }}
        />
        <KPICard
          title="Pending Actions"
          value={pendingShipments.length}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/30"
          subtitle="shipments to process"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ShipmentPerformanceChart />
        </div>

        {/* Pending Shipments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Actions</CardTitle>
              <Badge variant="warning">{pendingShipments.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingShipments.map((s) => (
              <div key={s.id} className="rounded-lg border p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono font-semibold text-primary">{s.shipmentNumber}</p>
                  <Badge variant="outline" className={cn("text-xs capitalize", getStatusColor(s.status))}>
                    {s.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">From: {s.fromName}</p>
                <p className="text-xs text-muted-foreground">ETA: {formatDate(s.estimatedArrival)}</p>
                <p className="text-xs">{s.products.length} product(s)</p>
              </div>
            ))}
            {pendingShipments.length === 0 && (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                No pending actions
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShipmentTracker limit={4} />
        <RiskAlertsWidget />
      </div>

      <ActivityFeed limit={5} />
    </div>
  )
}

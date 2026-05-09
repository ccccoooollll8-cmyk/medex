"use client"

import { AlertTriangle, CheckCircle2, DollarSign, Package, Truck, TrendingUp } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RiskAlertsWidget } from "@/components/dashboard/risk-alerts"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { ShipmentTracker } from "@/components/dashboard/shipment-tracker"
import { KPI_BY_ROLE, MOCK_PRODUCTS } from "@/lib/mock-data"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SupplierDashboard() {
  const kpi = KPI_BY_ROLE.supplier
  const lowStockProducts = MOCK_PRODUCTS.filter((p) => p.status === "low_stock")

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">PharmaCorp International · Manage your inventory and outgoing shipments</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Products"
          value={formatNumber(kpi.totalProducts)}
          icon={Package}
          iconColor="text-blue-500"
          iconBg="bg-blue-50 dark:bg-blue-950/30"
          trend={{ value: 12, label: "vs last month" }}
          subtitle="across all categories"
        />
        <KPICard
          title="Active Shipments"
          value={kpi.activeShipments}
          icon={Truck}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-950/30"
          subtitle="in transit now"
        />
        <KPICard
          title="Low Stock Alerts"
          value={kpi.lowStockAlerts}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/30"
          subtitle="need reorder"
        />
        <KPICard
          title="Inventory Value"
          value={formatCurrency(kpi.inventoryValue)}
          icon={DollarSign}
          iconColor="text-green-500"
          iconBg="bg-green-50 dark:bg-green-950/30"
          trend={{ value: 8.3, label: "vs last month" }}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InventoryChart />
        </div>
        <RiskAlertsWidget />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShipmentTracker limit={3} />

        {/* Low Stock Panel */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-base">Low Stock Products</CardTitle>
              </div>
              <Badge variant="warning" className="text-xs">{lowStockProducts.length} items</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.map((product) => {
              const pct = Math.round((product.quantity / 100) * 100)
              return (
                <div key={product.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-xs">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{product.sku}</p>
                    </div>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                  <Progress value={Math.min(pct, 20)} className="h-1.5" />
                </div>
              )
            })}
            {lowStockProducts.length === 0 && (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                All stock levels healthy
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <ActivityFeed limit={6} />
    </div>
  )
}

"use client"

import { Activity, AlertTriangle, DollarSign, Package, Shield, TrendingUp, Truck, Users } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RiskAlertsWidget } from "@/components/dashboard/risk-alerts"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { ShipmentPerformanceChart } from "@/components/dashboard/shipment-chart"
import { CategoryPieChart } from "@/components/dashboard/category-chart"
import { ShipmentTracker } from "@/components/dashboard/shipment-tracker"
import { KPI_BY_ROLE, DEMO_USERS, MOCK_PRODUCTS, MOCK_SHIPMENTS } from "@/lib/mock-data"
import { formatCurrency, formatNumber, getRoleColor, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const kpi = KPI_BY_ROLE.admin

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">MedX Platform · Full system overview and control</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Products"
          value={formatNumber(kpi.totalProducts)}
          icon={Package}
          iconColor="text-blue-500"
          iconBg="bg-blue-50 dark:bg-blue-950/30"
          trend={{ value: 15, label: "vs last month" }}
        />
        <KPICard
          title="Active Shipments"
          value={kpi.activeShipments}
          icon={Truck}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-950/30"
          subtitle="across all parties"
        />
        <KPICard
          title="Verified Transactions"
          value={formatNumber(kpi.verifiedTransactions)}
          icon={Shield}
          iconColor="text-green-500"
          iconBg="bg-green-50 dark:bg-green-950/30"
          trend={{ value: 9.4, label: "vs last month" }}
        />
        <KPICard
          title="Total Inventory Value"
          value={formatCurrency(kpi.inventoryValue)}
          icon={DollarSign}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/30"
          trend={{ value: 6.8, label: "vs last month" }}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="On-Time Delivery"
          value={`${kpi.onTimeDeliveryRate}%`}
          icon={TrendingUp}
          iconColor="text-cyan-500"
          iconBg="bg-cyan-50 dark:bg-cyan-950/30"
        />
        <KPICard
          title="Active Users"
          value={DEMO_USERS.length}
          icon={Users}
          iconColor="text-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/30"
          subtitle="across all roles"
        />
        <KPICard
          title="Low Stock Alerts"
          value={kpi.lowStockAlerts}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/30"
          subtitle="critical items"
        />
        <KPICard
          title="Shipments This Month"
          value={kpi.shipmentsThisMonth}
          icon={Activity}
          iconColor="text-rose-500"
          iconBg="bg-rose-50 dark:bg-rose-950/30"
          trend={{ value: 14.2, label: "vs last month" }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryChart />
        <ShipmentPerformanceChart />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategoryPieChart />

        {/* User overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Platform Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEMO_USERS.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", {
                  "bg-blue-500": u.role === "supplier",
                  "bg-purple-500": u.role === "distributor",
                  "bg-green-500": u.role === "provider",
                  "bg-orange-500": u.role === "admin",
                })}>
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{u.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{u.company}</p>
                </div>
                <Badge variant="outline" className={cn("text-[10px] capitalize shrink-0", getRoleColor(u.role))}>
                  {u.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <RiskAlertsWidget />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShipmentTracker limit={5} />
        <ActivityFeed limit={8} />
      </div>
    </div>
  )
}

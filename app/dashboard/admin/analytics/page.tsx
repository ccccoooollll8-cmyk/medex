"use client"

import { BarChart3, Download, TrendingUp } from "lucide-react"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { ShipmentPerformanceChart } from "@/components/dashboard/shipment-chart"
import { CategoryPieChart } from "@/components/dashboard/category-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KPI_BY_ROLE } from "@/lib/mock-data"
import { formatCurrency, downloadCSV } from "@/lib/utils"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const EFFICIENCY_DATA = [
  { month: "Oct", efficiency: 86, turnover: 4.2, waste: 3.1 },
  { month: "Nov", efficiency: 88, turnover: 4.5, waste: 2.8 },
  { month: "Dec", efficiency: 85, turnover: 4.1, waste: 3.4 },
  { month: "Jan", efficiency: 90, turnover: 4.8, waste: 2.5 },
  { month: "Feb", efficiency: 91, turnover: 5.1, waste: 2.2 },
  { month: "Mar", efficiency: 93, turnover: 5.4, waste: 1.9 },
  { month: "Apr", efficiency: 92, turnover: 5.2, waste: 2.0 },
]

const kpi = KPI_BY_ROLE.admin

export default function AnalyticsPage() {
  const handleExport = () => {
    downloadCSV(EFFICIENCY_DATA, "medx-analytics")
    toast.success("Analytics report exported")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground text-sm">Supply chain performance metrics and insights</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Inventory Turnover", value: "5.2x", change: "+0.4x", positive: true },
          { label: "On-Time Delivery", value: `${kpi.onTimeDeliveryRate}%`, change: "+2.1%", positive: true },
          { label: "Stock Waste Rate", value: "2.0%", change: "-0.3%", positive: true },
          { label: "Supply Chain Cost", value: formatCurrency(48200), change: "-5.2%", positive: true },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
              <p className="text-xl font-bold">{metric.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${metric.positive ? "text-green-600 dark:text-green-400" : "text-red-600"}`}>
                <TrendingUp className="h-3 w-3" />
                {metric.change} vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryChart />
        <ShipmentPerformanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Supply Chain Efficiency</CardTitle>
              <p className="text-xs text-muted-foreground">Efficiency score, inventory turnover, and waste rate</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={EFFICIENCY_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="turnover" name="Turnover" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="waste" name="Waste %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <CategoryPieChart />
      </div>
    </div>
  )
}

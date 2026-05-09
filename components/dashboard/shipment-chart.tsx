"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SHIPMENT_PERFORMANCE_DATA } from "@/lib/mock-data"

export function ShipmentPerformanceChart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Shipment Performance</CardTitle>
        <p className="text-xs text-muted-foreground">On-time vs delayed deliveries by week</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={SHIPMENT_PERFORMANCE_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="onTime" name="On Time" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="delayed" name="Delayed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="returned" name="Returned" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_SHIPMENTS } from "@/lib/mock-data"
import { cn, formatDate, getStatusColor } from "@/lib/utils"
import type { Shipment, ShipmentStatus } from "@/lib/types"

const STATUS_STEPS: ShipmentStatus[] = ["pending", "dispatched", "in_transit", "delivered"]

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  dispatched: Package,
  in_transit: Truck,
  delivered: CheckCircle2,
  accepted: CheckCircle2,
  rejected: XCircle,
}

export function ShipmentTracker({ limit = 3 }: { limit?: number }) {
  const shipments = MOCK_SHIPMENTS.slice(0, limit)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Live Shipment Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {shipments.map((shipment) => (
          <ShipmentItem key={shipment.id} shipment={shipment} />
        ))}
      </CardContent>
    </Card>
  )
}

function ShipmentItem({ shipment }: { shipment: Shipment }) {
  const Icon = STATUS_ICONS[shipment.status] || Clock
  const currentStep = STATUS_STEPS.indexOf(
    shipment.status === "accepted" ? "delivered" : shipment.status as ShipmentStatus
  )

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono font-semibold text-primary">{shipment.shipmentNumber}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {shipment.fromName} → {shipment.toName}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn("text-xs capitalize", getStatusColor(shipment.status))}
        >
          {shipment.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {STATUS_STEPS.map((step, idx) => (
          <div key={step} className="flex flex-1 items-center gap-1">
            <div
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                idx <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
            {idx < STATUS_STEPS.length - 1 && null}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Dispatched: {formatDate(shipment.dispatchDate)}</span>
        <span>ETA: {formatDate(shipment.estimatedArrival)}</span>
      </div>

      <div className="flex items-center gap-1.5 text-[10px]">
        <span className="font-mono bg-muted px-1.5 py-0.5 rounded">#{shipment.trackingNumber}</span>
        {shipment.verified && (
          <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </span>
        )}
        {shipment.temperature && (
          <span className="text-blue-500">{shipment.temperature}°C</span>
        )}
      </div>
    </div>
  )
}

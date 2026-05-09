import { Truck } from "lucide-react"
import { ShipmentList } from "@/components/shipments/shipment-list"

export default function AdminShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">All Shipments</h1>
          <p className="text-muted-foreground text-sm">Platform-wide shipment monitoring and management</p>
        </div>
      </div>
      <ShipmentList canCreate={false} canAccept={false} role="admin" />
    </div>
  )
}

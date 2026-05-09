import { Truck } from "lucide-react"
import { ShipmentList } from "@/components/shipments/shipment-list"

export default function ProviderShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Received Orders</h1>
          <p className="text-muted-foreground text-sm">View and verify incoming medical supply shipments</p>
        </div>
      </div>
      <ShipmentList canCreate={false} canAccept={true} role="provider" />
    </div>
  )
}

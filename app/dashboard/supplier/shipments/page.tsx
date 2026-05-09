import { Truck } from "lucide-react"
import { ShipmentList } from "@/components/shipments/shipment-list"

export default function SupplierShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Outgoing Shipments</h1>
          <p className="text-muted-foreground text-sm">Manage and track all dispatched orders</p>
        </div>
      </div>
      <ShipmentList canCreate={true} canAccept={false} role="supplier" />
    </div>
  )
}

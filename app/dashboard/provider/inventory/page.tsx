import { Package } from "lucide-react"
import { ReceivedInventoryTable } from "@/components/inventory/received-inventory-table"

export default function ProviderInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Facility Inventory</h1>
          <p className="text-muted-foreground text-sm">Medical supplies received and available for use</p>
        </div>
      </div>
      <ReceivedInventoryTable />
    </div>
  )
}

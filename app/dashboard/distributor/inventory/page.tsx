import { Box } from "lucide-react"
import { ReceivedInventoryTable } from "@/components/inventory/received-inventory-table"

export default function DistributorInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Box className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Warehouse Stock</h1>
          <p className="text-muted-foreground text-sm">Products received from suppliers, available to dispatch</p>
        </div>
      </div>
      <ReceivedInventoryTable />
    </div>
  )
}

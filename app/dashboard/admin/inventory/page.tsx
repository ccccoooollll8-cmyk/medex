import { Package } from "lucide-react"
import { ProductTable } from "@/components/inventory/product-table"

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">All Inventory</h1>
          <p className="text-muted-foreground text-sm">Platform-wide inventory overview across all parties</p>
        </div>
      </div>
      <ProductTable canEdit={true} />
    </div>
  )
}

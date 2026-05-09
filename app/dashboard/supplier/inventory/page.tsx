import { Package } from "lucide-react"
import { ProductTable } from "@/components/inventory/product-table"

export default function SupplierInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground text-sm">Manage your products, batches, and stock levels</p>
        </div>
      </div>
      <ProductTable canEdit={true} />
    </div>
  )
}

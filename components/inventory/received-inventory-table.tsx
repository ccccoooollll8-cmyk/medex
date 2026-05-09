"use client"

import { useState, useEffect } from "react"
import { Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInventoryStore, useAuthStore } from "@/lib/store"
import { downloadCSV } from "@/lib/utils"
import { toast } from "sonner"

export function ReceivedInventoryTable() {
  const { user } = useAuthStore()
  const { inventory } = useInventoryStore()
  const [search, setSearch] = useState("")

  useEffect(() => {
    useInventoryStore.persist.rehydrate()
    const onFocus = () => useInventoryStore.persist.rehydrate()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  const items = inventory[user?.id ?? ""] ?? []

  const filtered = items.filter(
    (p) =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.batchNumber.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    downloadCSV(
      filtered.map((p) => ({
        Product: p.productName,
        SKU: p.sku,
        BatchNumber: p.batchNumber,
        Quantity: p.quantity,
      })),
      "received-inventory"
    )
    toast.success("Inventory exported to CSV")
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Received Stock
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {items.length} product line{items.length !== 1 ? "s" : ""}
            </span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5" disabled={items.length === 0}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, SKU, batch..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-16 text-center text-muted-foreground text-sm">
            {items.length === 0
              ? "No inventory yet. Accept an incoming shipment to stock your inventory."
              : "No products match your search."}
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Batch</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((item, idx) => (
                  <tr
                    key={`${item.productId}-${item.batchNumber}-${idx}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{item.productName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{item.sku}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{item.batchNumber}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={item.quantity < 10 ? "warning" : "secondary"}>
                        {item.quantity} units
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

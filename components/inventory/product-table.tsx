"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Blocks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product, ProductCategory } from "@/lib/types"
import { cn, formatCurrency, formatDate, getStatusColor, getDaysUntilExpiry, downloadCSV } from "@/lib/utils"
import { toast } from "sonner"
import { AddProductDialog } from "./add-product-dialog"
import { useProductStore } from "@/lib/store"

const CATEGORIES: ProductCategory[] = [
  "Surgical Supplies", "Pharmaceuticals", "Diagnostic Equipment", "PPE",
  "IV Supplies", "Wound Care", "Respiratory", "Orthopedics", "Cardiology", "Laboratory",
]

export function ProductTable({ canEdit = true }: { canEdit?: boolean }) {
  const { products, addProduct, removeProduct } = useProductStore()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.batchNumber.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === "all" || p.category === categoryFilter
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const handleDelete = (id: string) => {
    removeProduct(id)
    toast.success("Product removed from inventory")
  }

  const handleExport = () => {
    downloadCSV(
      filtered.map((p) => ({
        Name: p.name, SKU: p.sku, Batch: p.batchNumber, Category: p.category,
        Quantity: p.quantity, Unit: p.unit, ExpiryDate: p.expiryDate,
        Price: p.price, Status: p.status, Verified: p.verified,
      })),
      "medx-inventory"
    )
    toast.success("Inventory exported to CSV")
  }

  const handleAddProduct = (product: Product) => {
    addProduct(product)
    toast.success(`${product.name} added to inventory`)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or batch number..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="recalled">Recalled</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
          {canEdit && (
            <Button size="sm" onClick={() => setShowAddDialog(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filtered.length} of {products.length} products</span>
        <span>·</span>
        <span className="text-amber-600 dark:text-amber-400">
          {filtered.filter((p) => p.status === "low_stock").length} low stock
        </span>
        <span>·</span>
        <span className="text-green-600 dark:text-green-400">
          {filtered.filter((p) => p.verified).length} verified
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">SKU / Batch</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Qty</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Expiry</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">On-Chain</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((product) => {
                  const daysToExpiry = getDaysUntilExpiry(product.expiryDate)
                  const expiryWarning = daysToExpiry < 90
                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-xs">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground">{product.unit}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs">{product.sku}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{product.batchNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          "text-xs font-semibold",
                          product.quantity < 15 ? "text-red-600 dark:text-red-400" :
                          product.quantity < 50 ? "text-amber-600 dark:text-amber-400" : ""
                        )}>
                          {product.quantity.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs", expiryWarning ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground")}>
                          {formatDate(product.expiryDate)}
                          {expiryWarning && ` (${daysToExpiry}d)`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-medium">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn("text-[10px] capitalize", getStatusColor(product.status))}>
                          {product.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {product.blockchainTxHash ? (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${product.blockchainTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Sepolia tx: ${product.blockchainTxHash}`}
                            className="flex items-center justify-center gap-0.5 text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <Blocks className="h-3.5 w-3.5" />
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : product.verified ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <QrCode className="h-4 w-4" /> View QR Code
                            </DropdownMenuItem>
                            {canEdit && (
                              <>
                                <DropdownMenuItem className="gap-2">
                                  <Edit className="h-4 w-4" /> Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" /> Remove
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-muted-foreground text-sm">
                      No products found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddProductDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddProduct}
      />
    </div>
  )
}

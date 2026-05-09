"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  GitBranch,
  Package,
  Search,
  Shield,
  Truck,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TraceabilityEvent, TraceabilityEventType } from "@/lib/types"
import { cn, formatDateTime, getRoleColor } from "@/lib/utils"
import { useProductStore, useTraceabilityStore } from "@/lib/store"
import { getEtherscanUrl } from "@/lib/blockchain"

const EVENT_ICONS: Record<TraceabilityEventType, React.ElementType> = {
  manufactured: Package,
  quality_check: Shield,
  dispatched: Truck,
  received: CheckCircle2,
  transferred: GitBranch,
  delivered: CheckCircle2,
  used: Zap,
  recalled: Clock,
}

const EVENT_COLORS: Record<TraceabilityEventType, string> = {
  manufactured: "bg-blue-500",
  quality_check: "bg-cyan-500",
  dispatched: "bg-indigo-500",
  received: "bg-green-500",
  transferred: "bg-purple-500",
  delivered: "bg-emerald-500",
  used: "bg-rose-500",
  recalled: "bg-red-500",
}

export function TraceabilityView() {
  const { products } = useProductStore()
  const { events: allEvents } = useTraceabilityStore()
  const [selectedProduct, setSelectedProduct] = useState<string | null>("prod-001")
  const [search, setSearch] = useState("")

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const events = allEvents.filter(
    (e) => !selectedProduct || e.productId === selectedProduct
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const product = products.find((p) => p.id === selectedProduct)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product selector */}
      <div className="lg:col-span-1 space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8 h-8 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {filteredProducts.slice(0, 15).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={cn(
                    "w-full text-left rounded-lg border p-3 transition-all text-xs",
                    selectedProduct === p.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "hover:bg-muted/50"
                  )}
                >
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="font-mono text-muted-foreground mt-0.5">{p.sku}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {p.verified && (
                      <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                    <Badge variant="secondary" className="text-[9px] py-0">{p.category}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div className="lg:col-span-2 space-y-4">
        {/* Product header */}
        {product && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{product.name}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="font-mono text-xs text-muted-foreground">{product.batchNumber}</span>
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    {product.verified && (
                      <Badge variant="success" className="text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Chain Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="text-xs font-medium">{product.supplierName}</p>
                </div>
              </div>

              {/* Blockchain verified */}
              {product.verified && product.blockchainTxHash && (
                <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400">Blockchain Verified Chain of Custody</p>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground break-all">
                    Tx hash: {product.blockchainTxHash.slice(0, 42)}...
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                    {product.blockchainBlock && <span>Block: #{product.blockchainBlock.toLocaleString()}</span>}
                    <a
                      href={getEtherscanUrl(product.blockchainTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-0.5 ml-auto"
                    >
                      View on chain <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Product Movement Timeline</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">{events.length} events</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {events.length === 0 && selectedProduct && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No traceability events recorded yet for this product
              </div>
            )}
            {!selectedProduct && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Select a product to view its traceability timeline
              </div>
            )}
            {events.length > 0 && (
              <div className="space-y-0">
                {events.map((event, idx) => (
                  <TraceabilityEventCard
                    key={event.id}
                    event={event}
                    isLast={idx === events.length - 1}
                  />
                ))}

                {/* Placeholder future events */}
                {selectedProduct === "prod-001" && (
                  <>
                    <FutureEventCard label="Awaiting transfer to healthcare provider" />
                    <FutureEventCard label="Usage tracking at facility level" last />
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TraceabilityEventCard({ event, isLast }: { event: TraceabilityEvent; isLast: boolean }) {
  const Icon = EVENT_ICONS[event.eventType] || Clock
  const dotColor = EVENT_COLORS[event.eventType] || "bg-gray-400"

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-white shrink-0", dotColor)}>
          <Icon className="h-4 w-4" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border my-1" />}
      </div>
      <div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold capitalize">
              {event.eventType.replace("_", " ")}
            </p>
            {(event.fromEntity || event.toEntity) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {event.fromEntity && `From: ${event.fromEntity}`}
                {event.fromEntity && event.toEntity && " → "}
                {event.toEntity && `To: ${event.toEntity}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {event.verified && (
              <Badge variant="success" className="text-[10px] gap-0.5 py-0">
                <CheckCircle2 className="h-2.5 w-2.5" /> Verified
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Badge variant="outline" className={cn("text-[10px] py-0", getRoleColor(event.userRole))}>
              {event.userName}
            </Badge>
            {event.location && (
              <span className="text-muted-foreground">📍 {event.location}</span>
            )}
            <span className="text-muted-foreground">{formatDateTime(event.timestamp)}</span>
          </div>
          {event.notes && (
            <p className="text-xs text-muted-foreground italic">{event.notes}</p>
          )}
          {event.blockchainHash && (
            <a
              href={getEtherscanUrl(event.blockchainHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-primary/60 hover:text-primary truncate flex items-center gap-0.5"
            >
              Hash: {event.blockchainHash.slice(0, 42)}... <ExternalLink className="h-2.5 w-2.5 shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function FutureEventCard({ label, last = false }: { label: string; last?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 shrink-0">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </div>
        {!last && <div className="w-0.5 flex-1 bg-border/50 border-dashed my-1" />}
      </div>
      <div className={cn("pb-6 flex-1", last && "pb-0")}>
        <p className="text-xs text-muted-foreground/60 italic mt-2">{label}</p>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  Plus,
  Search,
  Thermometer,
  Truck,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Shipment, ShipmentStatus, TraceabilityEvent, UserRole } from "@/lib/types"
import { cn, formatDate, formatDateTime, getStatusColor, downloadCSV } from "@/lib/utils"
import { toast } from "sonner"
import { useShipmentStore, useTraceabilityStore, useAuthStore, useWalletStore, useInventoryStore } from "@/lib/store"
import { DispatchShipmentDialog } from "./dispatch-shipment-dialog"
import { recordReceiveOnChain, getEtherscanUrl } from "@/lib/blockchain"

const STATUS_STEPS: { key: ShipmentStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "dispatched", label: "Dispatched" },
  { key: "in_transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
]

function filterByRole(shipments: Shipment[], role: string): Shipment[] {
  switch (role) {
    case "supplier":
      return shipments.filter((s) => s.fromRole === "supplier")
    case "distributor":
      return shipments.filter((s) => s.toRole === "distributor")
    case "distributor_outgoing":
      return shipments.filter((s) => s.fromRole === "distributor")
    case "provider":
      return shipments.filter((s) => s.toRole === "provider")
    default:
      return shipments
  }
}

export function ShipmentList({
  canCreate = false,
  canAccept = false,
  role = "admin",
}: {
  canCreate?: boolean
  canAccept?: boolean
  role?: string
}) {
  const { shipments, updateShipmentStatus, markShipmentVerified } = useShipmentStore()
  const { addEvent } = useTraceabilityStore()
  const { user } = useAuthStore()
  const { address } = useWalletStore()
  const { addToInventory } = useInventoryStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dispatchOpen, setDispatchOpen] = useState(false)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)
  const contractDeployed = !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const pathname = usePathname()

  // Rehydrate on every navigation (pathname change) AND on window focus
  useEffect(() => {
    useShipmentStore.persist.rehydrate()
    const onFocus = () => useShipmentStore.persist.rehydrate()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [pathname])

  const roleShipments = filterByRole(shipments, role)

  const filtered = roleShipments.filter((s) => {
    const matchSearch =
      s.shipmentNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.fromName.toLowerCase().includes(search.toLowerCase()) ||
      s.toName.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleAccept = async (shipment: Shipment) => {
    setAcceptingId(shipment.id)
    const now = new Date().toISOString()

    let chainTxHash: string | null = null
    let chainBlock: number | null = null

    if (address && contractDeployed) {
      try {
        const result = await recordReceiveOnChain(
          shipment.id,
          shipment.fromName,
          shipment.toName,
          user?.role ?? role
        )
        chainTxHash = result.txHash
        chainBlock = result.blockNumber

        markShipmentVerified(shipment.id, result.txHash, result.blockNumber)

        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Shipment received — recorded on Sepolia!</span>
            <a
              href={getEtherscanUrl(result.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary underline flex items-center gap-1"
            >
              View transaction
            </a>
          </div>,
          { duration: 8000 }
        )
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Transaction failed"
        if (msg.includes("user rejected") || msg.includes("ACTION_REJECTED")) {
          toast.warning("Transaction cancelled — shipment accepted locally only.")
        } else {
          toast.error(msg.slice(0, 120))
        }
      }
    } else {
      toast.success("Shipment accepted")
    }

    updateShipmentStatus(shipment.id, "accepted", now)
    addToInventory(user?.id ?? role, shipment.products)

    shipment.products.forEach((sp) => {
      const event: TraceabilityEvent = {
        id: `trace-${Date.now()}-${sp.productId}`,
        productId: sp.productId,
        productName: sp.productName,
        eventType: "received",
        fromEntity: shipment.fromName,
        toEntity: shipment.toName,
        location: shipment.toName,
        timestamp: now,
        userId: user?.id ?? "unknown",
        userName: user?.name ?? "Unknown",
        userRole: (user?.role ?? role) as UserRole,
        shipmentId: shipment.id,
        notes: `Received via ${shipment.shipmentNumber}`,
        verified: !!chainTxHash,
        blockchainHash: chainTxHash ?? undefined,
      }
      addEvent(event)
    })

    setAcceptingId(null)
  }

  const handleReject = (id: string) => {
    updateShipmentStatus(id, "rejected")
    toast.error("Shipment marked as rejected")
  }

  const handleExport = () => {
    downloadCSV(
      filtered.map((s) => ({
        ShipmentNumber: s.shipmentNumber,
        From: s.fromName,
        To: s.toName,
        Status: s.status,
        Dispatched: s.dispatchDate,
        ETA: s.estimatedArrival,
        TrackingNumber: s.trackingNumber,
        Verified: s.verified,
      })),
      "medx-shipments"
    )
    toast.success("Shipments exported to CSV")
  }

  return (
    <>
      <DispatchShipmentDialog
        open={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        role={role}
      />
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shipments, tracking numbers..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
            {canCreate && (
              <Button size="sm" className="gap-1.5" onClick={() => setDispatchOpen(true)}>
                <Plus className="h-4 w-4" /> New Shipment
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{filtered.length} shipments</p>

        {/* Shipment cards */}
        <div className="space-y-3">
          {filtered.map((shipment) => {
            const isExpanded = expanded === shipment.id
            const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === shipment.status)
            const progressIdx = shipment.status === "accepted" ? STATUS_STEPS.length - 1 : currentStepIdx

            return (
              <Card key={shipment.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-mono text-sm font-semibold text-primary">{shipment.shipmentNumber}</p>
                          {shipment.verified && (
                            <span className="flex items-center gap-0.5 text-[10px] text-green-600 dark:text-green-400">
                              <CheckCircle2 className="h-3 w-3" /> Blockchain Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{shipment.fromName} → {shipment.toName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={cn("text-xs capitalize", getStatusColor(shipment.status))}>
                        {shipment.status.replace("_", " ")}
                      </Badge>
                      {canAccept && shipment.toRole === role && (shipment.status === "delivered" || shipment.status === "dispatched" || shipment.status === "in_transit") && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/20"
                            onClick={() => handleAccept(shipment)}
                            disabled={acceptingId === shipment.id}
                          >
                            {acceptingId === shipment.id
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : <CheckCircle2 className="h-3 w-3" />}
                            {acceptingId === shipment.id ? "Signing..." : "Accept"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => handleReject(shipment.id)}
                            disabled={acceptingId === shipment.id}
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </Button>
                        </div>
                      )}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : shipment.id)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 flex items-center gap-0">
                    {STATUS_STEPS.map((step, idx) => {
                      const done = idx <= progressIdx
                      const current = idx === progressIdx
                      return (
                        <div key={step.key} className="flex flex-1 flex-col items-center gap-1">
                          <div className="flex items-center w-full">
                            <div className={cn("h-0.5 flex-1", idx === 0 ? "opacity-0" : done ? "bg-primary" : "bg-muted")} />
                            <div className={cn(
                              "h-2.5 w-2.5 rounded-full border-2 shrink-0 transition-colors",
                              done ? "border-primary bg-primary" : "border-muted bg-background",
                              current && "ring-2 ring-primary/30"
                            )} />
                            <div className={cn("h-0.5 flex-1", idx === STATUS_STEPS.length - 1 ? "opacity-0" : done && idx < progressIdx ? "bg-primary" : "bg-muted")} />
                          </div>
                          <span className={cn("text-[10px] text-center", done ? "text-primary font-medium" : "text-muted-foreground")}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Dispatched: {formatDate(shipment.dispatchDate)}</span>
                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">#{shipment.trackingNumber}</span>
                    <span>ETA: {formatDate(shipment.estimatedArrival)}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t bg-muted/30 p-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">From</p>
                        <p className="font-medium">{shipment.fromName}</p>
                        <p className="text-muted-foreground capitalize">{shipment.fromRole}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">To</p>
                        <p className="font-medium">{shipment.toName}</p>
                        <p className="text-muted-foreground capitalize">{shipment.toRole}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Temperature</p>
                        {shipment.temperature ? (
                          <p className="font-medium flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-blue-500" />
                            {shipment.temperature}°C
                          </p>
                        ) : <p className="text-muted-foreground">N/A</p>}
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Actual Arrival</p>
                        <p className="font-medium">{shipment.actualArrival ? formatDate(shipment.actualArrival) : "Pending"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium mb-2">Products ({shipment.products.length})</p>
                      <div className="space-y-1.5">
                        {shipment.products.map((p) => (
                          <div key={p.productId} className="flex items-center justify-between rounded-md bg-background border px-3 py-2 text-xs">
                            <div>
                              <p className="font-medium">{p.productName}</p>
                              <p className="text-muted-foreground font-mono">{p.sku} · {p.batchNumber}</p>
                            </div>
                            <span className="font-semibold">{p.quantity} units</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {shipment.notes && (
                      <p className="text-xs text-muted-foreground italic">{shipment.notes}</p>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl border bg-card p-16 text-center text-muted-foreground text-sm">
              No shipments found
            </div>
          )}
        </div>
      </div>
    </>
  )
}

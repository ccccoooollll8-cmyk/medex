"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Blocks, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Shipment, ShipmentProduct, TraceabilityEvent, UserRole } from "@/lib/types"
import { useAuthStore, useProductStore, useShipmentStore, useTraceabilityStore, useWalletStore, useInventoryStore } from "@/lib/store"
import { recordDispatchOnChain, getEtherscanUrl } from "@/lib/blockchain"

const ROLE_DESTINATIONS: Record<string, { id: string; name: string; role: UserRole }> = {
  supplier: { id: "user-002", name: "MedDistribute Inc.", role: "distributor" },
  distributor: { id: "user-003", name: "City General Hospital", role: "provider" },
}

type AvailableItem = {
  id: string
  name: string
  quantity: number
  sku: string
  batchNumber: string
}

function generateShipmentNumber() {
  return `SHP-${Date.now().toString().slice(-6)}`
}

function generateTrackingNumber() {
  return `TRK${Math.random().toString(36).toUpperCase().slice(2, 10)}`
}

type Step = "idle" | "signing" | "broadcasting" | "confirming" | "done"

const STEP_LABEL: Record<Step, string> = {
  idle: "Dispatch Shipment",
  signing: "Waiting for MetaMask...",
  broadcasting: "Broadcasting to Sepolia...",
  confirming: "Confirming on-chain...",
  done: "Confirmed!",
}

interface DispatchShipmentDialogProps {
  open: boolean
  onClose: () => void
  role: string
}

interface LineItem {
  productId: string
  quantity: string
}

export function DispatchShipmentDialog({ open, onClose, role }: DispatchShipmentDialogProps) {
  const { user } = useAuthStore()
  const { address } = useWalletStore()
  const { products, updateProductQuantity } = useProductStore()
  const { addShipment, markShipmentVerified } = useShipmentStore()
  const { addEvent, updateEventVerification } = useTraceabilityStore()
  const { inventory, deductFromInventory } = useInventoryStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [estimatedArrival, setEstimatedArrival] = useState("")
  const [notes, setNotes] = useState("")
  const [lines, setLines] = useState<LineItem[]>([{ productId: "", quantity: "" }])

  const destination = ROLE_DESTINATIONS[role === "distributor_outgoing" ? "distributor" : role]
  const contractDeployed = !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  const receivedInventory = inventory[user?.id ?? ""] ?? []
  const availableItems: AvailableItem[] = role === "supplier"
    ? products
        .filter((p) => p.status !== "recalled" && p.quantity > 0)
        .map((p) => ({ id: p.id, name: p.name, quantity: p.quantity, sku: p.sku, batchNumber: p.batchNumber }))
    : receivedInventory
        .filter((p) => p.quantity > 0)
        .map((p) => ({ id: p.productId, name: p.productName, quantity: p.quantity, sku: p.sku, batchNumber: p.batchNumber }))

  const addLine = () => setLines((prev) => [...prev, { productId: "", quantity: "" }])
  const removeLine = (idx: number) => setLines((prev) => prev.filter((_, i) => i !== idx))
  const updateLine = (idx: number, field: keyof LineItem, value: string) =>
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)))

  const reset = () => {
    setLines([{ productId: "", quantity: "" }])
    setEstimatedArrival("")
    setNotes("")
    setStep("idle")
    setTxHash(null)
  }

  const handleSubmit = async () => {
    if (!estimatedArrival) {
      toast.error("Please set an estimated arrival date")
      return
    }
    const validLines = lines.filter((l) => l.productId && l.quantity && Number(l.quantity) > 0)
    if (validLines.length === 0) {
      toast.error("Add at least one product with a valid quantity")
      return
    }
    if (!destination) {
      toast.error("No destination configured for this role")
      return
    }

    setLoading(true)

    const shipmentProducts: ShipmentProduct[] = validLines.map((l) => {
      const item = availableItems.find((a) => a.id === l.productId)!
      return {
        productId: item.id,
        productName: item.name,
        sku: item.sku,
        batchNumber: item.batchNumber,
        quantity: Number(l.quantity),
      }
    })

    const now = new Date().toISOString()
    const shipment: Shipment = {
      id: `shp-${Date.now()}`,
      shipmentNumber: generateShipmentNumber(),
      fromId: user?.id ?? "unknown",
      fromName: user?.company ?? user?.name ?? "Unknown",
      fromRole: (user?.role ?? "supplier") as UserRole,
      toId: destination.id,
      toName: destination.name,
      toRole: destination.role,
      products: shipmentProducts,
      status: "dispatched",
      dispatchDate: now,
      estimatedArrival: new Date(estimatedArrival).toISOString(),
      trackingNumber: generateTrackingNumber(),
      notes: notes || undefined,
      verified: false,
      createdAt: now,
      updatedAt: now,
    }

    // ── Save to store immediately (don't block on MetaMask) ─────────────
    addShipment(shipment)

    if (role === "supplier") {
      validLines.forEach((l) => updateProductQuantity(l.productId, -Number(l.quantity)))
    } else {
      deductFromInventory(
        user?.id ?? "",
        validLines.map((l) => ({ productId: l.productId, quantity: Number(l.quantity) }))
      )
    }

    const dispatchEventIds: string[] = []
    shipmentProducts.forEach((sp) => {
      const eventId = `trace-${Date.now()}-${sp.productId}`
      dispatchEventIds.push(eventId)
      const event: TraceabilityEvent = {
        id: eventId,
        productId: sp.productId,
        productName: sp.productName,
        eventType: "dispatched",
        fromEntity: user?.company ?? user?.name ?? "Supplier",
        toEntity: destination.name,
        location: `${user?.company ?? "Supplier"} → ${destination.name}`,
        timestamp: now,
        userId: user?.id ?? "user-001",
        userName: user?.name ?? "Supplier",
        userRole: (user?.role ?? "supplier") as UserRole,
        shipmentId: shipment.id,
        notes: notes || `Dispatched via ${shipment.shipmentNumber}`,
        verified: false,
        blockchainHash: undefined,
      }
      addEvent(event)
    })

    toast.success(`Shipment ${shipment.shipmentNumber} dispatched to ${destination.name}`)

    // ── Blockchain recording (optional enhancement) ──────────────────────
    if (address && contractDeployed) {
      try {
        setStep("signing")
        const result = await recordDispatchOnChain(
          shipment.id,
          shipment.fromName,
          destination.name,
          user?.role ?? "supplier"
        )
        setStep("broadcasting")
        setTxHash(result.txHash)
        await new Promise((r) => setTimeout(r, 400))
        setStep("confirming")
        await new Promise((r) => setTimeout(r, 300))
        setStep("done")

        markShipmentVerified(shipment.id, result.txHash, result.blockNumber)
        dispatchEventIds.forEach((id) => updateEventVerification(id, result.txHash))

        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Shipment recorded on Sepolia!</span>
            <a
              href={getEtherscanUrl(result.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" /> View transaction
            </a>
          </div>,
          { duration: 8000 }
        )
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Transaction failed"
        if (msg.includes("user rejected") || msg.includes("ACTION_REJECTED")) {
          toast.warning("MetaMask cancelled — shipment already saved locally.")
        } else {
          toast.error(msg.slice(0, 120))
        }
        setStep("idle")
      }
    }

    setLoading(false)
    reset()
    onClose()
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !loading && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Dispatch New Shipment
            {contractDeployed && address && (
              <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Blocks className="h-3.5 w-3.5" /> Sepolia ready
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {destination && (
            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Destination: </span>
              <span className="font-medium">{destination.name}</span>
              <span className="ml-2 text-xs text-muted-foreground capitalize">({destination.role})</span>
            </div>
          )}

          <div className="space-y-2">
            <Label>Products</Label>
            {availableItems.length === 0 ? (
              <p className="text-sm text-muted-foreground rounded-lg border border-dashed px-4 py-3">
                No stock available to dispatch. Accept an incoming shipment first.
              </p>
            ) : (
            <>
            <div className="space-y-2">
              {lines.map((line, idx) => {
                const usedIds = lines.filter((_, i) => i !== idx).map((l) => l.productId)
                const options = availableItems.filter((a) => !usedIds.includes(a.id))
                const selected = availableItems.find((a) => a.id === line.productId)
                return (
                  <div key={idx} className="flex gap-2 items-start">
                    <Select value={line.productId} onValueChange={(v) => updateLine(idx, "productId", v)}>
                      <SelectTrigger className="flex-1 text-sm">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                            <span className="ml-1 text-xs text-muted-foreground">({a.quantity} units)</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min={1}
                      max={selected?.quantity}
                      placeholder="Qty"
                      className="w-24 text-sm"
                      value={line.quantity}
                      onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                    />
                    {lines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeLine(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
            {lines.length < availableItems.length && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={addLine}>
                <Plus className="h-3.5 w-3.5" /> Add Product
              </Button>
            )}
            </>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eta">Estimated Arrival</Label>
            <Input
              id="eta"
              type="date"
              min={minDateStr}
              value={estimatedArrival}
              onChange={(e) => setEstimatedArrival(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Special handling instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Blockchain step indicator */}
          {loading && step !== "idle" && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{STEP_LABEL[step]}</span>
              {txHash && (
                <a
                  href={getEtherscanUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" /> Track
                </a>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : address && contractDeployed
              ? <Blocks className="h-4 w-4" />
              : null}
            {loading
              ? STEP_LABEL[step]
              : address && contractDeployed
              ? "Sign & Dispatch on Sepolia"
              : "Dispatch Shipment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

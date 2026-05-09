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
import type { Product, ProductCategory } from "@/lib/types"
import { generateSKU, generateBatchNumber } from "@/lib/utils"
import { useAuthStore, useWalletStore, useTraceabilityStore } from "@/lib/store"
import type { TraceabilityEvent } from "@/lib/types"
import { registerProductOnChain, getEtherscanUrl, connectWallet, truncateAddress } from "@/lib/blockchain"
import { Loader2, Blocks, ExternalLink, AlertTriangle, Wallet } from "lucide-react"
import { toast } from "sonner"

const CATEGORIES: ProductCategory[] = [
  "Surgical Supplies", "Pharmaceuticals", "Diagnostic Equipment", "PPE",
  "IV Supplies", "Wound Care", "Respiratory", "Orthopedics", "Cardiology", "Laboratory",
]

type Step = "idle" | "signing" | "broadcasting" | "confirming" | "done"

interface AddProductDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (product: Product) => void
}

export function AddProductDialog({ open, onClose, onAdd }: AddProductDialogProps) {
  const { user } = useAuthStore()
  const { address, setAddress } = useWalletStore()
  const { addEvent } = useTraceabilityStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    category: "" as ProductCategory,
    quantity: "",
    unit: "units",
    expiryDate: "",
    price: "",
    description: "",
  })

  const stepLabel: Record<Step, string> = {
    idle: "Add Product",
    signing: "Waiting for MetaMask...",
    broadcasting: "Broadcasting to Sepolia...",
    confirming: "Confirming on-chain...",
    done: "Confirmed!",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.category) return
    setLoading(true)
    setStep("idle")
    setTxHash(null)

    const product: Product = {
      id: `prod-${Date.now()}`,
      name: form.name,
      sku: generateSKU(form.category, form.name),
      batchNumber: generateBatchNumber(),
      category: form.category,
      quantity: parseInt(form.quantity),
      unit: form.unit,
      expiryDate: form.expiryDate,
      manufacturingDate: new Date().toISOString().split("T")[0],
      supplierId: user?.id || "user-001",
      supplierName: user?.company || "PharmaCorp International",
      description: form.description,
      price: parseFloat(form.price),
      status: parseInt(form.quantity) < 20 ? "low_stock" : "active",
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (address && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      try {
        setStep("signing")
        const { txHash: hash, blockNumber } = await registerProductOnChain(product, user?.role || "supplier")
        setStep("broadcasting")
        setTxHash(hash)
        await new Promise((r) => setTimeout(r, 800))
        setStep("confirming")
        await new Promise((r) => setTimeout(r, 600))
        setStep("done")

        product.verified = true
        product.blockchainTxHash = hash
        product.blockchainBlock = blockNumber

        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Product registered on Sepolia!</span>
            <a
              href={getEtherscanUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              View transaction
            </a>
          </div>,
          { duration: 8000 }
        )
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Transaction failed"
        if (msg.includes("user rejected") || msg.includes("ACTION_REJECTED")) {
          toast.warning("Transaction cancelled by user.")
        } else {
          toast.error(msg.slice(0, 120))
        }
        setLoading(false)
        setStep("idle")
        return
      }
    } else {
      await new Promise((r) => setTimeout(r, 600))
      if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
        toast.info("Product added locally. Deploy the contract to enable Sepolia registration.")
      } else {
        toast.info("Product added locally. Connect your wallet to register on Sepolia.")
      }
    }

    const traceEvent: TraceabilityEvent = {
      id: `trace-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      eventType: "manufactured",
      toEntity: user?.company ?? user?.name ?? "Supplier",
      location: "Supplier Facility",
      timestamp: new Date().toISOString(),
      userId: user?.id ?? "user-001",
      userName: user?.name ?? "Supplier",
      userRole: "supplier",
      notes: `Product registered${product.blockchainTxHash ? " on Sepolia blockchain" : " in system"}`,
      verified: !!product.blockchainTxHash,
      blockchainHash: product.blockchainTxHash,
    }
    addEvent(traceEvent)

    onAdd(product)
    setForm({ name: "", category: "" as ProductCategory, quantity: "", unit: "units", expiryDate: "", price: "", description: "" })
    setLoading(false)
    setStep("idle")
    setTxHash(null)
    onClose()
  }

  const handleConnectWallet = async () => {
    try {
      const acc = await connectWallet()
      setAddress(acc)
      toast.success(`Wallet connected: ${truncateAddress(acc)}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed"
      if (!msg.includes("rejected")) toast.error(msg)
    }
  }

  const contractDeployed = !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Add New Product
            {contractDeployed && (
              <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Blocks className="h-3.5 w-3.5" />
                Sepolia ready
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Wallet status banner */}
        {contractDeployed && !address && (
          <div className="flex items-center justify-between rounded-lg border border-dashed border-amber-400/50 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 text-xs">
            <span className="text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Connect wallet to register on Sepolia
            </span>
            <Button size="sm" variant="outline" className="h-6 text-xs gap-1" onClick={handleConnectWallet}>
              <Wallet className="h-3 w-3" />
              Connect
            </Button>
          </div>
        )}

        {address && contractDeployed && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
            <Blocks className="h-3.5 w-3.5" />
            <span>Signing as <span className="font-mono font-medium">{truncateAddress(address)}</span> on Sepolia</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              required
              placeholder="e.g. Amoxicillin 500mg Capsules"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as ProductCategory })}
                disabled={loading}
              >
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                required
                placeholder="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                placeholder="units, boxes, vials..."
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Unit Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiry">Expiry Date *</Label>
            <Input
              id="expiry"
              type="date"
              required
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Input
              id="desc"
              placeholder="Optional product description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Blockchain status during submit */}
          {loading && step !== "idle" && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{stepLabel[step]}</span>
              {txHash && (
                <a
                  href={getEtherscanUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Track
                </a>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : address && contractDeployed ? (
                <Blocks className="h-4 w-4" />
              ) : null}
              {loading
                ? stepLabel[step]
                : address && contractDeployed
                ? "Sign & Register on Sepolia"
                : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

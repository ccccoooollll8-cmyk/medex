"use client"

import { useEffect, useState } from "react"
import { Loader2, Wallet, ExternalLink, LogOut, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWalletStore } from "@/lib/store"
import { useAuthStore } from "@/lib/store"
import {
  connectWallet,
  getCurrentAccount,
  hasMetaMask,
  truncateAddress,
  getEtherscanUrl,
} from "@/lib/blockchain"
import { ROLE_WALLETS } from "@/lib/contract-abi"
import { toast } from "sonner"

export function WalletConnect() {
  const { address, isConnecting, setAddress, setConnecting } = useWalletStore()
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Returns MetaMask's currently selected address even if not formally connected to this site
    const getSelected = (): string | null =>
      ((window.ethereum as unknown as { selectedAddress?: string })?.selectedAddress) ?? null

    const syncAccount = async () => {
      const acc = await getCurrentAccount()
      setAddress(acc ?? getSelected())
    }

    syncAccount()

    // Re-sync when the tab becomes visible (catches MetaMask switches while tab was in background)
    const handleVisibility = () => {
      if (!document.hidden) syncAccount()
    }
    document.addEventListener("visibilitychange", handleVisibility)

    if (window.ethereum) {
      const handler = (accounts: unknown) => {
        const accs = accounts as string[]
        setAddress(accs?.[0] ?? getSelected())
      }
      window.ethereum.on("accountsChanged", handler)

      // Poll MetaMask's selected address every second — catches account switches
      // that don't emit accountsChanged (e.g. switching to a non-connected account)
      const interval = setInterval(() => setAddress(getSelected()), 1000)

      return () => {
        clearInterval(interval)
        window.ethereum?.removeListener("accountsChanged", handler)
        document.removeEventListener("visibilitychange", handleVisibility)
      }
    }

    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [setAddress])

  if (!mounted) return null

  if (!hasMetaMask()) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
      >
        <Wallet className="h-3.5 w-3.5" />
        Install MetaMask
      </Button>
    )
  }

  const handleConnect = async () => {
    setConnecting(true)
    try {
      const acc = await connectWallet()
      setAddress(acc)
      toast.success(`Wallet connected: ${truncateAddress(acc)}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed"
      if (!msg.includes("rejected")) toast.error(msg)
    } finally {
      setConnecting(false)
    }
  }

  if (!address) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs border-dashed"
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Wallet className="h-3.5 w-3.5" />
        )}
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  const expectedWallet = user?.role ? ROLE_WALLETS[user.role] : null
  const isMatchingRole =
    expectedWallet && address.toLowerCase() === expectedWallet.toLowerCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 text-xs font-mono ${
            isMatchingRole
              ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
              : "border-amber-500/50 text-amber-600 dark:text-amber-400"
          }`}
        >
          {isMatchingRole ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          {truncateAddress(address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-sm">Sepolia Testnet</span>
            <span className="font-mono text-xs text-muted-foreground break-all">{address}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!isMatchingRole && expectedWallet && (
          <div className="px-3 py-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 mx-1 rounded-md mb-1">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Expected: {truncateAddress(expectedWallet)} for {user?.role} role
          </div>
        )}

        {isMatchingRole && (
          <div className="px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 mx-1 rounded-md mb-1">
            <CheckCircle2 className="h-3 w-3 inline mr-1" />
            Wallet matches {user?.role} role — ready to sign
          </div>
        )}

        <DropdownMenuItem
          className="gap-2 text-xs"
          onClick={() =>
            window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank")
          }
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View on Sepolia Etherscan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-xs text-destructive focus:text-destructive"
          onClick={() => {
            setAddress(null)
            toast.info("Wallet disconnected")
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useProductStore, useShipmentStore, useTraceabilityStore, useInventoryStore } from "@/lib/store"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { DemoBanner } from "@/components/demo-banner"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/types"

const ROLE_ACCENT: Record<UserRole, string> = {
  supplier: "border-t-[3px] border-blue-500",
  distributor: "border-t-[3px] border-purple-500",
  provider: "border-t-[3px] border-green-500",
  admin: "border-t-[3px] border-orange-500",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const loadProducts = useProductStore((s) => s.loadFromDB)
  const loadShipments = useShipmentStore((s) => s.loadFromDB)
  const loadEvents = useTraceabilityStore((s) => s.loadFromDB)
  const loadInventory = useInventoryStore((s) => s.loadFromDB)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    loadProducts()
    loadShipments()
    loadEvents()
    loadInventory()
  }, [isAuthenticated, router, loadProducts, loadShipments, loadEvents, loadInventory])

  if (!isAuthenticated) return null

  const accentClass = user ? ROLE_ACCENT[user.role] : ""

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DemoBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className={cn("flex flex-1 flex-col overflow-hidden", accentClass)}>
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

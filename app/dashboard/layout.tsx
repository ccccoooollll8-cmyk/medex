"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useProductStore, useShipmentStore, useTraceabilityStore, useInventoryStore } from "@/lib/store"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { DemoBanner } from "@/components/demo-banner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
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
    // Load all data from Supabase once on dashboard mount
    loadProducts()
    loadShipments()
    loadEvents()
    loadInventory()
  }, [isAuthenticated, router, loadProducts, loadShipments, loadEvents, loadInventory])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DemoBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

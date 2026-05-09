"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  BarChart3,
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Shield,
  Truck,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore, useUIStore } from "@/lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/lib/types"
import { toast } from "sonner"

const NAV_BY_ROLE: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  supplier: [
    { href: "/dashboard/supplier", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/supplier/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/supplier/shipments", label: "Shipments", icon: Truck },
    { href: "/dashboard/supplier/traceability", label: "Traceability", icon: GitBranch },
  ],
  distributor: [
    { href: "/dashboard/distributor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/distributor/inventory", label: "Warehouse Stock", icon: Box },
    { href: "/dashboard/distributor/shipments", label: "Shipments", icon: Truck },
    { href: "/dashboard/distributor/traceability", label: "Traceability", icon: GitBranch },
  ],
  provider: [
    { href: "/dashboard/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/provider/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/provider/shipments", label: "Received Orders", icon: Truck },
    { href: "/dashboard/provider/traceability", label: "Verify Products", icon: Shield },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/inventory", label: "All Inventory", icon: Package },
    { href: "/dashboard/admin/shipments", label: "All Shipments", icon: Truck },
    { href: "/dashboard/admin/traceability", label: "Traceability", icon: GitBranch },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/audit", label: "Audit Logs", icon: ClipboardList },
  ],
}

const ROLE_COLORS: Record<UserRole, string> = {
  supplier: "bg-blue-500",
  distributor: "bg-purple-500",
  provider: "bg-green-500",
  admin: "bg-orange-500",
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  if (!user) return null

  const navItems = NAV_BY_ROLE[user.role]

  const handleLogout = () => {
    logout()
    toast.success("Signed out successfully")
    router.push("/")
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b px-4", sidebarOpen ? "gap-2.5" : "justify-center")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-5 w-5 text-white" />
        </div>
        {sidebarOpen && <span className="font-bold text-lg">MedX</span>}
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                !sidebarOpen && "justify-center px-2"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-3 space-y-1">
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            !sidebarOpen && "justify-center px-2"
          )}
          title={!sidebarOpen ? "Settings" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {sidebarOpen && "Settings"}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            !sidebarOpen && "justify-center px-2"
          )}
          title={!sidebarOpen ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {sidebarOpen && "Sign Out"}
        </button>

        {sidebarOpen && (
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={cn("text-white text-xs font-bold", ROLE_COLORS[user.role])}>
                {user.avatar || user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              <Badge
                variant="outline"
                className="mt-0.5 text-[10px] h-4 capitalize px-1.5"
              >
                {user.role}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

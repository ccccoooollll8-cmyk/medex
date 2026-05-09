"use client"

import { Bell, Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MOCK_RISK_ALERTS } from "@/lib/mock-data"
import { WalletConnect } from "@/components/blockchain/wallet-connect"

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()
  const criticalAlerts = MOCK_RISK_ALERTS.filter((a) => a.riskLevel === "critical" || a.riskLevel === "high")

  return (
    <header className="flex h-16 items-center gap-4 border-b px-6 bg-card">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, shipments..."
            className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <WalletConnect />
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {criticalAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="destructive" className="text-xs">{criticalAlerts.length} urgent</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {criticalAlerts.slice(0, 3).map((alert) => (
              <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-0.5 py-3">
                <span className="text-xs font-semibold">{alert.productName}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">{alert.message.slice(0, 80)}...</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary text-xs font-medium justify-center">
              View all alerts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

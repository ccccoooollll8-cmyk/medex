"use client"

import { Users, Plus, Search, MoreHorizontal, Shield } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DEMO_USERS } from "@/lib/mock-data"
import { getRoleColor, cn, formatDate } from "@/lib/utils"
import { toast } from "sonner"

export default function UsersPage() {
  const [search, setSearch] = useState("")

  const filtered = DEMO_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground text-sm">Manage platform users and their role permissions</p>
          </div>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => toast.info("User invite coming soon")}>
          <Plus className="h-4 w-4" /> Invite User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["supplier", "distributor", "provider", "admin"].map((role) => {
          const count = DEMO_USERS.filter((u) => u.role === role).length
          return (
            <Card key={role}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground capitalize mb-1">{role}s</p>
                <p className="text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Company</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                        u.role === "supplier" ? "bg-blue-500" :
                        u.role === "distributor" ? "bg-purple-500" :
                        u.role === "provider" ? "bg-green-500" : "bg-orange-500"
                      )}>
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <p className="text-xs font-medium">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-xs">{u.company}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("text-[10px] capitalize", getRoleColor(u.role))}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="success" className="text-[10px]">Active</Badge>
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
                        <DropdownMenuItem className="gap-2" onClick={() => toast.info("Edit user coming soon")}>
                          <Shield className="h-4 w-4" /> Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive focus:text-destructive"
                          onClick={() => toast.error("User deactivation requires confirmation")}
                        >
                          Deactivate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

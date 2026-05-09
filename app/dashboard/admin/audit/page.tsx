"use client"

import { ClipboardList, Download, Filter, Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_ACTIVITY_LOGS } from "@/lib/mock-data"
import { getRoleColor, cn, formatDateTime, downloadCSV } from "@/lib/utils"
import { toast } from "sonner"

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  DISPATCH: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  ACCEPT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  TRANSFER: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  VERIFY: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  RECEIVE: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  VIEW: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function AuditPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")

  const filtered = MOCK_ACTIVITY_LOGS.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || log.userRole === roleFilter
    const matchAction = actionFilter === "all" || log.action === actionFilter
    return matchSearch && matchRole && matchAction
  })

  const handleExport = () => {
    downloadCSV(
      filtered.map((l) => ({
        Timestamp: l.timestamp,
        User: l.userName,
        Role: l.userRole,
        Action: l.action,
        Resource: l.resource,
        Details: l.details,
        IP: l.ipAddress,
      })),
      "medx-audit-log"
    )
    toast.success("Audit log exported")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground text-sm">Immutable record of all system actions and user activity</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {["CREATE", "UPDATE", "DELETE", "DISPATCH", "ACCEPT", "TRANSFER", "VERIFY"].map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} log entries</p>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Resource</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Details</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">{formatDateTime(log.timestamp)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-medium">{log.userName}</p>
                        <Badge variant="outline" className={cn("text-[9px] mt-0.5 capitalize", getRoleColor(log.userRole))}>
                          {log.userRole}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("text-[10px]", ACTION_COLORS[log.action] || "")}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">{log.resource}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">{log.ipAddress || "—"}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground text-sm">
                      No logs matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  iconColor?: string
  iconBg?: string
  trend?: { value: number; label: string }
  loading?: boolean
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  trend,
  loading,
}: KPICardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", iconBg)}>
            <Icon className={cn("h-4.5 w-4.5", iconColor)} />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {(subtitle || trend) && (
          <div className="mt-1.5 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  trend.value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Activity, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const DEMO_ACCOUNTS = [
  {
    role: "supplier" as const,
    email: "supplier@medchain.demo",
    name: "Sarah Chen",
    company: "PharmaCorp International",
    color: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    role: "distributor" as const,
    email: "distributor@medchain.demo",
    name: "Michael Torres",
    company: "MedDistribute Inc.",
    color: "bg-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    role: "provider" as const,
    email: "provider@medchain.demo",
    name: "Dr. Emily Watson",
    company: "City General Hospital",
    color: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    role: "admin" as const,
    email: "admin@medchain.demo",
    name: "James Patel",
    company: "MedChain Platform",
    color: "bg-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-950/50",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)

  const { login, loginAsDemo } = useAuthStore()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        const { user } = useAuthStore.getState()
        toast.success(`Welcome back, ${user?.name}!`)
        router.push(`/dashboard/${user?.role}`)
      } else {
        toast.error("Invalid credentials. Use password: demo123")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role: typeof DEMO_ACCOUNTS[0]["role"]) => {
    setDemoLoading(role)
    await new Promise((r) => setTimeout(r, 600))
    loginAsDemo(role)
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)!
    toast.success(`Logged in as ${account.name}`)
    router.push(`/dashboard/${role}`)
    setDemoLoading(null)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">MedChain</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in to your healthcare supply chain dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or try a demo account</span>
            </div>
          </div>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                onClick={() => handleDemoLogin(account.role)}
                disabled={demoLoading !== null}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                  account.bgColor,
                  account.borderColor
                )}
              >
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", account.color)}>
                  {account.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{account.company}</p>
                </div>
                <Badge variant="outline" className="text-xs capitalize shrink-0">
                  {account.role}
                </Badge>
                {demoLoading === account.role && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo password: <code className="font-mono bg-muted px-1 py-0.5 rounded">demo123</code>
          </p>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-blue-600/5 to-indigo-600/10 border-l relative overflow-hidden p-12">
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-6">
            <Activity className="h-9 w-9 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Healthcare supply chain, fully visible</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Track every product from supplier to patient. Verify authenticity. Prevent stockouts before they happen.
          </p>

          <div className="space-y-3 text-left">
            {[
              "Blockchain-verified product tracking",
              "AI-powered supply risk alerts",
              "Role-based workflow management",
              "Real-time shipment monitoring",
              "HIPAA & regulatory compliance",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

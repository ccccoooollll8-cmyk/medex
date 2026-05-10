"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe,
  Lock,
  Package,
  Shield,
  Truck,
  Users,
  Zap,
  Star,
  TrendingUp,
  AlertTriangle,
  QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DemoBanner } from "@/components/demo-banner"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const STATS = [
  { label: "Medical Products Tracked", value: "2.4M+" },
  { label: "Shipments Verified", value: "890K+" },
  { label: "Healthcare Providers", value: "1,200+" },
  { label: "Supply Chain Accuracy", value: "99.8%" },
]

const FEATURES = [
  {
    icon: Package,
    title: "Full Inventory Control",
    description:
      "Manage SKUs, batch numbers, expiry dates, and quantities with precision. Auto-generate QR codes for every product.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Truck,
    title: "Real-Time Shipment Tracking",
    description:
      "Follow every shipment from supplier to distributor to healthcare provider with live status updates.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: Shield,
    title: "Chain-of-Custody Traceability",
    description:
      "Immutable audit trail for every product movement. Blockchain-verified transactions with tamper-proof logs.",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: AlertTriangle,
    title: "AI Risk Alerts",
    description:
      "Predictive intelligence for stock depletion, expiry risks, and supplier delays before they become problems.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: Users,
    title: "Role-Based Workflows",
    description:
      "Tailored dashboards for suppliers, distributors, healthcare providers, and admins with granular permissions.",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: BarChart3,
    title: "Supply Chain Analytics",
    description:
      "Inventory turnover, shipment performance, category insights, and efficiency metrics in one place.",
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
]

const TESTIMONIALS = [
  {
    quote: "MedX gave us end-to-end visibility across our entire supply chain. We caught three near-expiry batches before they became a problem.",
    name: "Dr. Priya Nair",
    title: "Chief Pharmacy Officer, Apollo Health",
    initials: "PN",
    color: "bg-blue-500",
  },
  {
    quote: "The traceability features are exactly what we needed for regulatory compliance. Implementation took days, not months.",
    name: "Raj Krishnamurthy",
    title: "VP Operations, MedSupply Co.",
    initials: "RK",
    color: "bg-purple-500",
  },
  {
    quote: "AI risk alerts have reduced our stockout incidents by 78%. The ROI was visible within the first quarter.",
    name: "Sarah Hoffman",
    title: "Supply Chain Director, Regional Health Network",
    initials: "SH",
    color: "bg-green-500",
  },
]

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated && user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />

      {/* Navigation */}
      <nav
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          scrolled
            ? "border-b bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">MedX</span>
              <Badge variant="secondary" className="ml-1 text-xs">v0.9 Beta</Badge>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/login">
                <Button size="sm" className="gap-1.5">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1 text-sm">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            AI-Powered Healthcare Supply Chain
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            Supply Chain
            <span className="block text-primary">Traceability,</span>
            <span className="block">Redefined.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
            MedX gives healthcare organizations end-to-end visibility across the medical supply chain.
            Track products from manufacturer to patient with blockchain-verified audit trails.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="gap-2 px-8 h-12 text-base">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base">
                View Demo <Play className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · 14-day free trial · HIPAA compliant
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-muted/50 border-b">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">medx.health/dashboard</span>
            </div>
            <div className="bg-muted/20 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Products", value: "85", icon: Package, color: "text-blue-500", change: "+12%" },
                { label: "Active Shipments", value: "10", icon: Truck, color: "text-indigo-500", change: "+3" },
                { label: "Low Stock Alerts", value: "7", icon: AlertTriangle, color: "text-amber-500", change: "Critical" },
                { label: "Verified Transactions", value: "287", icon: CheckCircle2, color: "text-green-500", change: "99.8%" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className={cn("text-xs mt-1", kpi.color)}>{kpi.change}</p>
                </div>
              ))}
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 rounded-xl border bg-card p-4">
                <p className="text-sm font-medium mb-4">Inventory Trend</p>
                <div className="flex items-end gap-2 h-24">
                  {[45, 62, 48, 71, 85, 92, 78, 95, 88, 102, 94, 110].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-primary/80" style={{ height: `${(h / 110) * 100}%` }} />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm font-medium mb-3">Recent Activity</p>
                <div className="space-y-2.5">
                  {[
                    { text: "Shipment SH-10891 delivered", color: "bg-green-500" },
                    { text: "Low stock: Amoxicillin", color: "bg-amber-500" },
                    { text: "New product verified", color: "bg-blue-500" },
                    { text: "Transfer initiated", color: "bg-purple-500" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.color)} />
                      <span className="text-muted-foreground truncate">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Platform Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Everything your supply chain needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for healthcare, MedX covers every stage of the medical supply chain
              with purpose-built tools for each stakeholder.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={cn("inline-flex rounded-lg p-2.5 mb-4", feature.bg)}>
                  <feature.icon className={cn("h-5 w-5", feature.color)} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Chain of Custody</Badge>
            <h2 className="text-4xl font-bold mb-4">Track every step of the journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every product movement is recorded, verified, and immutable — from manufacturing floor to patient bedside.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Supplier Creates", desc: "Products are registered with full details, QR codes generated, batch verified.", icon: Package, color: "bg-blue-500" },
              { step: "02", title: "Distributor Receives", desc: "Shipments accepted and logged. Warehouse stock updated in real-time.", icon: Truck, color: "bg-indigo-500" },
              { step: "03", title: "Provider Verifies", desc: "Healthcare providers confirm authenticity and log receipt with blockchain hash.", icon: CheckCircle2, color: "bg-green-500" },
              { step: "04", title: "Admin Audits", desc: "Full audit trail visible to admins. Exportable compliance reports at any time.", icon: Shield, color: "bg-purple-500" },
            ].map((step, idx) => (
              <div key={step.step} className="relative">
                <div className="rounded-xl border bg-card p-6 text-center">
                  <div className={cn("mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white", step.color)}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mb-2">{step.step}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold mb-4">Trusted by healthcare leaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl border bg-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold", t.color)}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border bg-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            </div>
            <Badge variant="outline" className="mb-6">Try It Now — No Sign Up Required</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience MedX with demo access</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Log in as any role to explore the full platform. All data is simulated — no registration needed.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { role: "supplier", label: "Supplier", color: "bg-blue-500 hover:bg-blue-600" },
                { role: "distributor", label: "Distributor", color: "bg-purple-500 hover:bg-purple-600" },
                { role: "provider", label: "Provider", color: "bg-green-500 hover:bg-green-600" },
                { role: "admin", label: "Admin", color: "bg-orange-500 hover:bg-orange-600" },
              ].map((demo) => (
                <DemoLoginButton key={demo.role} {...demo} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">MedX</span>
              <span className="text-muted-foreground text-sm">Healthcare Supply Chain Platform</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> HIPAA Compliant</span>
              <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> SOC 2 Type II</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> ISO 13485</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2025 MedX Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Play({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function DemoLoginButton({ role, label, color }: { role: string; label: string; color: string }) {
  const { loginAsDemo } = useAuthStore()
  const router = useRouter()

  const handleClick = () => {
    loginAsDemo(role as "supplier" | "distributor" | "provider" | "admin")
    router.push(`/dashboard/${role}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-xl px-4 py-3 text-white text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        color
      )}
    >
      {label} Demo
    </button>
  )
}

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
  AlertTriangle,
  Cpu,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DemoBanner } from "@/components/demo-banner"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const CHAIN_EVENTS = [
  "Block #19,847,231 · Paracetamol Batch B-2891 · Verified ✓ · Hash 0x7f4a2c…",
  "Block #19,847,229 · Shipment SH-10891 · Delivered ✓ · Hash 0x3d8b1f…",
  "Block #19,847,228 · Amoxicillin 500mg · Dispatched · Hash 0x9e2c4a…",
  "Block #19,847,226 · Cold Chain Alert · Resolved ✓ · Hash 0x1a5d7e…",
  "Block #19,847,224 · Insulin Batch I-447 · Transferred · Hash 0x6c9f3b…",
  "Block #19,847,222 · City Hospital · Received ✓ · Hash 0x2e8a1d…",
  "Block #19,847,219 · Morphine 10mg · Verified ✓ · Hash 0xb4f7c9…",
  "Block #19,847,217 · ShipCo Transfer · Accepted · Hash 0x5a1e8d…",
]

const STATS = [
  { label: "Blocks Verified", value: "19.8M+" },
  { label: "Products on Chain", value: "2.4M+" },
  { label: "Healthcare Nodes", value: "1,200+" },
  { label: "Chain Accuracy", value: "99.8%" },
]

const FEATURES = [
  {
    icon: Database,
    title: "Immutable Ledger",
    description: "Every product, batch, and movement is cryptographically hashed and anchored on-chain. Tamper-proof by design — forever.",
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    glowBorder: "hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
  },
  {
    icon: Truck,
    title: "Real-Time Shipment Tracking",
    description: "Follow every shipment from supplier to distributor to healthcare provider with live on-chain status at every node.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    glowBorder: "hover:border-blue-400/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
  },
  {
    icon: Shield,
    title: "Chain-of-Custody Traceability",
    description: "Every product movement generates a signed blockchain transaction. Multi-party verification with cryptographic proof of authenticity.",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    glowBorder: "hover:border-violet-400/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)]",
  },
  {
    icon: AlertTriangle,
    title: "Predictive Risk Intelligence",
    description: "AI-powered early alerts for stock depletion, expiry risks, and supplier delays — resolved before they reach patients.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    glowBorder: "hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
  },
  {
    icon: Users,
    title: "Multi-Party Workflows",
    description: "Purpose-built dashboards for suppliers, distributors, providers, and admins — each with blockchain-enforced permission boundaries.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    glowBorder: "hover:border-indigo-400/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]",
  },
  {
    icon: BarChart3,
    title: "On-Chain Analytics",
    description: "Inventory turnover, shipment performance, and efficiency metrics derived directly from verified on-chain transaction data.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    glowBorder: "hover:border-emerald-400/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
  },
]

const TESTIMONIALS = [
  {
    quote: "MedChain gave us end-to-end visibility across our entire supply chain. We caught three near-expiry batches before they became a problem.",
    name: "Dr. Priya Nair",
    title: "Chief Pharmacy Officer, Apollo Health",
    initials: "PN",
    color: "bg-cyan-500",
  },
  {
    quote: "The blockchain traceability is exactly what we needed for regulatory compliance. Implementation took days, not months.",
    name: "Raj Krishnamurthy",
    title: "VP Operations, MedSupply Co.",
    initials: "RK",
    color: "bg-violet-500",
  },
  {
    quote: "Cryptographic verification of every shipment has eliminated disputes entirely. The ROI was visible within the first quarter.",
    name: "Sarah Hoffman",
    title: "Supply Chain Director, Regional Health Network",
    initials: "SH",
    color: "bg-blue-500",
  },
]

const GRID_STYLE = {
  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.10) 1px, transparent 0)`,
  backgroundSize: "40px 40px",
}

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [blockNumber, setBlockNumber] = useState(19847231)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setBlockNumber((n) => n + 1), 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated && user) return null

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />

      {/* ── Navigation ── */}
      <nav
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-slate-950"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">MedChain</span>
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400">
                  Block #{blockNumber.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-7 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/25"
                >
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-28 pb-0">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10" style={GRID_STYLE} />
        <div className="absolute -z-10 top-0 left-1/4 h-[700px] w-[700px] rounded-full bg-cyan-600/12 blur-[140px]" />
        <div className="absolute -z-10 top-20 right-1/5 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -z-10 bottom-0 left-1/2 -translate-x-1/2 h-[200px] w-[800px] rounded-full bg-blue-600/10 blur-[80px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 mb-8 backdrop-blur-sm">
            <Cpu className="h-3.5 w-3.5" />
            Blockchain-Verified Healthcare Infrastructure
            <span className="ml-1 rounded-full bg-cyan-500/20 px-1.5 py-px text-[10px] font-mono text-cyan-400">LIVE</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[82px] font-bold tracking-tight leading-[1.05] mb-6">
            The Trust Layer for
            <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent pb-2">
              Medical Supply Chains
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            Every product movement cryptographically verified. Every transaction immutably recorded.
            MedChain brings blockchain-grade trust to healthcare logistics — from manufacturer to patient.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="gap-2 px-8 h-12 text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 shadow-2xl shadow-cyan-500/30 text-white"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 h-12 text-base border-white/15 text-slate-200 bg-white/5 hover:bg-white/10 hover:border-white/25 hover:text-white"
              >
                <Play className="h-4 w-4" /> View Live Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-600 mb-16">
            No credit card required · 14-day free trial · HIPAA & 21 CFR Part 11 compliant
          </p>
        </div>

        {/* Blockchain transaction ticker */}
        <div className="border-y border-white/[0.07] bg-white/[0.02] py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...CHAIN_EVENTS, ...CHAIN_EVENTS].map((event, i) => (
              <span key={i} className="mx-10 text-[11px] font-mono text-slate-500 inline-flex items-center gap-2">
                <span className="text-emerald-500">●</span>
                {event}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview — dark */}
        <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-t-2xl border border-white/10 border-b-0 bg-slate-900 overflow-hidden shadow-[0_-20px_80px_rgba(6,182,212,0.08)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/80 border-b border-white/[0.07]">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-[11px] text-slate-500 font-mono">medchain.health/dashboard/supplier</span>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected · Mainnet
              </div>
            </div>

            {/* KPI row */}
            <div className="bg-slate-900/50 p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Products", value: "85", icon: Package, color: "text-cyan-400", change: "+12% this month", bg: "border-cyan-500/20 bg-cyan-500/[0.07]" },
                { label: "Active Shipments", value: "10", icon: Truck, color: "text-blue-400", change: "+3 in transit", bg: "border-blue-500/20 bg-blue-500/[0.07]" },
                { label: "Low Stock Alerts", value: "7", icon: AlertTriangle, color: "text-amber-400", change: "2 critical", bg: "border-amber-500/20 bg-amber-500/[0.07]" },
                { label: "Verified on Chain", value: "287", icon: CheckCircle2, color: "text-emerald-400", change: "99.8% rate", bg: "border-emerald-500/20 bg-emerald-500/[0.07]" },
              ].map((kpi) => (
                <div key={kpi.label} className={cn("rounded-xl border p-4", kpi.bg)}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-400">{kpi.label}</p>
                    <kpi.icon className={cn("h-3.5 w-3.5", kpi.color)} />
                  </div>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className={cn("text-[11px] mt-1 font-mono", kpi.color)}>{kpi.change}</p>
                </div>
              ))}
            </div>

            {/* Chart + feed */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 rounded-xl border border-white/[0.07] bg-slate-800/40 p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-200">Inventory Trend</p>
                  <span className="text-[10px] text-slate-600 font-mono">Last 30 days</span>
                </div>
                <div className="flex items-end gap-1 h-20">
                  {[45, 62, 48, 71, 85, 92, 78, 95, 88, 102, 94, 110].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${(h / 110) * 100}%`,
                        background: `linear-gradient(to top, rgba(6,182,212,0.85), rgba(99,102,241,0.4))`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-slate-800/40 p-4">
                <p className="text-sm font-medium text-slate-200 mb-3">Chain Activity</p>
                <div className="space-y-2.5">
                  {[
                    { text: "SH-10891 block confirmed", dot: "bg-emerald-400" },
                    { text: "Amoxicillin batch verified", dot: "bg-cyan-400" },
                    { text: "Low stock: Insulin", dot: "bg-amber-400" },
                    { text: "Transfer SH-10892 signed", dot: "bg-violet-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.dot)} />
                      <span className="text-slate-500 truncate">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-slate-950 border-b border-white/[0.07] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-5 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20">
              Platform Capabilities
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Built on blockchain.{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Built for healthcare.
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every feature is backed by cryptographic verification — from product registration to final delivery confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={cn(
                  "group rounded-2xl border bg-card p-7 transition-all duration-300 cursor-default hover:-translate-y-1.5",
                  feature.glowBorder
                )}
              >
                <div className={cn("inline-flex rounded-xl p-3 mb-5", feature.bg)}>
                  <feature.icon className={cn("h-5 w-5", feature.color)} />
                </div>
                <h3 className="font-semibold text-base mb-2.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — dark ── */}
      <section id="how-it-works" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/60 to-violet-950/40" />
        <div className="absolute inset-0" style={GRID_STYLE} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[900px] rounded-full bg-blue-600/8 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-5 border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              Chain of Custody
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-white">
              Every step,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                permanently on record
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              From manufacturing floor to patient bedside — every handoff generates a cryptographically signed, immutable blockchain event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                title: "Supplier Registers",
                desc: "Products registered with cryptographic ID and QR hash. Batch details permanently anchored on-chain.",
                icon: Package,
                gradient: "from-cyan-500 to-cyan-700",
                glow: "shadow-cyan-500/30",
                connector: "via-cyan-500/30",
              },
              {
                step: "02",
                title: "Distributor Receives",
                desc: "Multi-party acceptance creates an immutable handoff event. Warehouse stock synced across all network nodes.",
                icon: Truck,
                gradient: "from-blue-500 to-blue-700",
                glow: "shadow-blue-500/30",
                connector: "via-blue-500/30",
              },
              {
                step: "03",
                title: "Provider Verifies",
                desc: "Healthcare providers cryptographically confirm authenticity. Blockchain hash logged at point of delivery.",
                icon: CheckCircle2,
                gradient: "from-violet-500 to-violet-700",
                glow: "shadow-violet-500/30",
                connector: "via-violet-500/30",
              },
              {
                step: "04",
                title: "Admin Audits",
                desc: "Full immutable audit trail for compliance teams. One-click export with cryptographic proof of every event.",
                icon: Shield,
                gradient: "from-emerald-500 to-emerald-700",
                glow: "shadow-emerald-500/30",
                connector: null,
              },
            ].map((step, idx) => (
              <div key={step.step} className="relative">
                {step.connector && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%-12px)] w-6 h-0.5 bg-gradient-to-r from-white/20 to-white/5 z-10" />
                )}
                <div className="rounded-2xl border border-white/20 bg-slate-800/70 backdrop-blur-md p-6 text-center hover:border-white/35 hover:bg-slate-800/90 transition-all duration-300 hover:-translate-y-1">
                  <div className={cn("mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-xl", step.gradient, step.glow)}>
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="inline-block text-[10px] font-mono text-slate-500 bg-slate-800/70 rounded-full px-2.5 py-0.5 mb-3">
                    STEP {step.step}
                  </div>
                  <h3 className="font-semibold mb-2.5 text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — light ── */}
      <section id="testimonials" className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-5">Testimonials</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                healthcare leaders
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border bg-card p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-0.5 mb-5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5 border-t">
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold", t.color)}>
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

      {/* ── Demo CTA — dark ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/70 to-violet-950/50" />
        <div className="absolute inset-0" style={GRID_STYLE} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-cyan-600/8 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-6 border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            No Sign Up Required
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-white">
            Experience MedChain{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              right now
            </span>
          </h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg">
            Log in as any role to explore the full platform. All blockchain data is simulated — no registration or credit card needed.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { role: "supplier", label: "Supplier", gradient: "from-cyan-500 to-cyan-700", glow: "shadow-cyan-500/30" },
              { role: "distributor", label: "Distributor", gradient: "from-violet-500 to-violet-700", glow: "shadow-violet-500/30" },
              { role: "provider", label: "Provider", gradient: "from-emerald-500 to-green-700", glow: "shadow-emerald-500/30" },
              { role: "admin", label: "Admin", gradient: "from-orange-500 to-amber-600", glow: "shadow-orange-500/30" },
            ].map((demo) => (
              <DemoLoginButton key={demo.role} role={demo.role} label={demo.label} gradient={demo.gradient} glow={demo.glow} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.07] bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">MedChain</span>
              <span className="text-slate-600 text-sm">Blockchain Healthcare Platform</span>
            </div>

            <div className="flex items-center gap-5 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> HIPAA Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> SOC 2 Type II
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> 21 CFR Part 11
              </span>
            </div>

            <p className="text-xs text-slate-700">© 2025 MedChain Inc. All rights reserved.</p>
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

function DemoLoginButton({
  role,
  label,
  gradient,
  glow,
}: {
  role: string
  label: string
  gradient: string
  glow: string
}) {
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
        "rounded-xl px-4 py-4 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:translate-y-0 bg-gradient-to-br",
        gradient,
        glow
      )}
    >
      {label} Demo
    </button>
  )
}

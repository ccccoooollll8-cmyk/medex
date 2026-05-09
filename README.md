# MedX — Healthcare Supply Chain Platform

> **Demo Environment — MedX v0.9** · A production-style healthtech SaaS MVP

MedX is a full-stack healthcare supply chain management platform that provides end-to-end traceability from manufacturer to patient, AI-powered risk alerts, and role-based workflows for every stakeholder in the medical supply chain.

---

## Demo Credentials

| Role | Email | Password | Company |
|------|-------|----------|---------|
| **Supplier** | `supplier@medx.demo` | `demo123` | PharmaCorp International |
| **Distributor** | `distributor@medx.demo` | `demo123` | MedDistribute Inc. |
| **Provider** | `provider@medx.demo` | `demo123` | City General Hospital |
| **Admin** | `admin@medx.demo` | `demo123` | MedX Platform |

> Or click the **demo login buttons** on the login page — no password needed.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file (already included for demo):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=demo
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + CSS Variables |
| Components | shadcn/ui (Radix UI primitives) |
| State | Zustand (persisted auth + UI state) |
| Charts | Recharts |
| Auth | Supabase (configured for demo mode) |
| Notifications | Sonner |
| Date utilities | date-fns |

---

## Architecture Overview

```
medx/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/login/page.tsx         # Login with demo accounts
│   └── dashboard/
│       ├── layout.tsx              # Auth guard + sidebar layout
│       ├── supplier/               # Supplier role pages
│       ├── distributor/            # Distributor role pages
│       ├── provider/               # Healthcare provider pages
│       └── admin/                  # Admin pages (analytics, users, audit)
├── components/
│   ├── ui/                         # Reusable UI primitives (shadcn/ui)
│   ├── layout/                     # Sidebar, Topbar
│   ├── dashboard/                  # KPI cards, charts, activity feed
│   ├── inventory/                  # Product table, add product dialog
│   ├── shipments/                  # Shipment list with tracker
│   └── traceability/               # Timeline view + blockchain mock
├── lib/
│   ├── types.ts                    # TypeScript type definitions
│   ├── mock-data.ts                # 50+ seeded demo products & data
│   ├── store.ts                    # Zustand auth + UI state
│   └── utils.ts                    # Helpers: format, export, colors
└── public/
```

---

## Features

### Auth & Roles
- Login / demo instant-access buttons
- Role-based dashboard routing (supplier/distributor/provider/admin)
- Persisted auth session via Zustand

### Inventory Management
- Add/Edit/Delete products with auto-generated SKU + batch numbers
- Expiry date tracking with visual warnings
- Category filtering, search, CSV export
- Low stock highlighting

### Shipment Tracking
- Full shipment lifecycle: pending → dispatched → in transit → delivered → accepted
- Accept/reject actions for distributors and providers
- Expandable detail view with product manifest
- Temperature tracking, blockchain verification badge
- CSV export

### Chain-of-Custody Traceability
- Timeline view for each product's journey
- Blockchain hash display (mock) with immutable log entries
- Verified badges at each step
- Supplier → Distributor → Healthcare Provider flow

### AI Supply Risk Alerts
- Predictive stock depletion warnings
- Expiry risk detection
- Supplier delay and demand spike alerts
- Color-coded by severity (critical/high/medium/low)

### Analytics (Admin)
- Inventory flow area chart
- Shipment performance bar chart
- Category distribution pie chart
- Supply chain efficiency line chart
- One-click report export

### Audit Logs (Admin)
- Immutable activity log with user, action, resource, IP
- Filter by role and action type
- CSV export

---

## Design System

- **Colors**: MedX Blue (`#0ea5e9`) primary with semantic role colors
- **Dark/Light mode**: System-aware with manual toggle
- **Typography**: Inter font, tight tracking
- **Cards**: Rounded-xl with subtle shadows
- **Animations**: Fade-in, skeleton loaders, smooth transitions
- **Empty states**: Friendly messages for zero data
- **Toast notifications**: Success/error/info via Sonner

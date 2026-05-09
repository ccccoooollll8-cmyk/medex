"use client"

import { AlertCircle, X } from "lucide-react"
import { useState } from "react"

export function DemoBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-4 py-2 text-white text-sm font-medium">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>
        <strong>Demo Environment</strong> — MedX v0.9 · All data is simulated · No real medical data is stored
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 rounded p-0.5 hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

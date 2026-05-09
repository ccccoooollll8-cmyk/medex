import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRole, Product, Shipment, ShipmentProduct, TraceabilityEvent } from "./types";
import { DEMO_USERS, MOCK_PRODUCTS, MOCK_SHIPMENTS, MOCK_TRACEABILITY } from "./mock-data";

interface WalletState {
  address: string | null
  isConnecting: boolean
  setAddress: (address: string | null) => void
  setConnecting: (v: boolean) => void
}

export const useWalletStore = create<WalletState>()((set) => ({
  address: null,
  isConnecting: false,
  setAddress: (address) => set({ address }),
  setConnecting: (isConnecting) => set({ isConnecting }),
}))

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        await new Promise((r) => setTimeout(r, 800));
        const user = DEMO_USERS.find((u) => u.email === email);
        if (user && password === "demo123") {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      loginAsDemo: (role: UserRole) => {
        const user = DEMO_USERS.find((u) => u.role === role);
        if (user) set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "medx-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

interface ProductState {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
  updateProductQuantity: (id: string, delta: number) => void
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      removeProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      updateProductQuantity: (id, delta) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, quantity: Math.max(0, p.quantity + delta), updatedAt: new Date().toISOString() }
              : p
          ),
        })),
    }),
    {
      name: "medx-products",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

interface ShipmentState {
  shipments: Shipment[]
  addShipment: (shipment: Shipment) => void
  updateShipmentStatus: (id: string, status: Shipment["status"], actualArrival?: string) => void
  markShipmentVerified: (id: string, txHash: string, blockNumber: number) => void
}

export const useShipmentStore = create<ShipmentState>()(
  persist(
    (set) => ({
      shipments: MOCK_SHIPMENTS,
      addShipment: (shipment) => set((state) => ({ shipments: [shipment, ...state.shipments] })),
      updateShipmentStatus: (id, status, actualArrival) =>
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === id
              ? { ...s, status, updatedAt: new Date().toISOString(), ...(actualArrival ? { actualArrival } : {}) }
              : s
          ),
        })),
      markShipmentVerified: (id, txHash, blockNumber) =>
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === id
              ? { ...s, verified: true, blockchainTxHash: txHash, blockchainBlock: blockNumber, updatedAt: new Date().toISOString() }
              : s
          ),
        })),
    }),
    {
      name: "medx-shipments",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

interface TraceabilityState {
  events: TraceabilityEvent[]
  addEvent: (event: TraceabilityEvent) => void
  updateEventVerification: (id: string, txHash: string) => void
}

export const useTraceabilityStore = create<TraceabilityState>()(
  persist(
    (set) => ({
      events: MOCK_TRACEABILITY,
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEventVerification: (id, txHash) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, verified: true, blockchainHash: txHash } : e
          ),
        })),
    }),
    {
      name: "medx-traceability",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

interface InventoryState {
  inventory: Record<string, ShipmentProduct[]>
  addToInventory: (userId: string, products: ShipmentProduct[]) => void
  deductFromInventory: (userId: string, deductions: { productId: string; quantity: number }[]) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      // Pre-seed distributor inventory from the accepted mock shipment (ship-004)
      inventory: {
        "user-002": [
          { productId: "prod-019", productName: "Epinephrine Auto-Injector", sku: "MX-PH-EPI-001", batchNumber: "BT-2025-0089", quantity: 20 },
          { productId: "prod-024", productName: "Defibrillator Pads Adult", sku: "MX-CL-DP-ADU", batchNumber: "BT-2025-0145", quantity: 30 },
        ],
      },
      addToInventory: (userId, products) =>
        set((state) => {
          const current = [...(state.inventory[userId] ?? [])]
          for (const p of products) {
            const idx = current.findIndex(
              (m) => m.productId === p.productId && m.batchNumber === p.batchNumber
            )
            if (idx >= 0) {
              current[idx] = { ...current[idx], quantity: current[idx].quantity + p.quantity }
            } else {
              current.push({ ...p })
            }
          }
          return { inventory: { ...state.inventory, [userId]: current } }
        }),
      deductFromInventory: (userId, deductions) =>
        set((state) => {
          const current = state.inventory[userId] ?? []
          const updated = current
            .map((item) => {
              const d = deductions.find((x) => x.productId === item.productId)
              return d ? { ...item, quantity: item.quantity - d.quantity } : item
            })
            .filter((item) => item.quantity > 0)
          return { inventory: { ...state.inventory, [userId]: updated } }
        }),
    }),
    {
      name: "medx-inventory",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as InventoryState
        if (version < 1 || !state.inventory?.["user-002"]?.length) {
          return {
            ...state,
            inventory: {
              ...state.inventory,
              "user-002": state.inventory?.["user-002"]?.length
                ? state.inventory["user-002"]
                : [
                    { productId: "prod-019", productName: "Epinephrine Auto-Injector", sku: "MX-PH-EPI-001", batchNumber: "BT-2025-0089", quantity: 20 },
                    { productId: "prod-024", productName: "Defibrillator Pads Adult", sku: "MX-CL-DP-ADU", batchNumber: "BT-2025-0145", quantity: 30 },
                  ],
            },
          }
        }
        return state
      },
    }
  )
)

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Cross-tab sync: rehydrate stores when another tab writes to localStorage
if (typeof window !== "undefined") {
  const STORE_MAP: Record<string, () => void> = {
    "medx-shipments": () => useShipmentStore.persist.rehydrate(),
    "medx-inventory": () => useInventoryStore.persist.rehydrate(),
    "medx-products": () => useProductStore.persist.rehydrate(),
    "medx-traceability": () => useTraceabilityStore.persist.rehydrate(),
  }
  window.addEventListener("storage", (e) => {
    if (e.key && STORE_MAP[e.key]) STORE_MAP[e.key]()
  })
}

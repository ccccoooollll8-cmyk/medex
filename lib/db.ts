import type { Product, Shipment, TraceabilityEvent, ShipmentProduct } from "./types"
import { supabase } from "./supabase"
import { MOCK_PRODUCTS, MOCK_SHIPMENTS, MOCK_TRACEABILITY } from "./mock-data"

type Row = Record<string, unknown>

// ── Mappers ───────────────────────────────────────────────────────────────────

export function productFromDB(r: Row): Product {
  return {
    id: r.id as string,
    name: r.name as string,
    sku: r.sku as string,
    batchNumber: r.batch_number as string,
    category: r.category as Product["category"],
    quantity: r.quantity as number,
    unit: r.unit as string,
    expiryDate: r.expiry_date as string,
    manufacturingDate: r.manufacturing_date as string,
    supplierId: r.supplier_id as string,
    supplierName: r.supplier_name as string,
    description: (r.description as string) ?? undefined,
    price: Number(r.price),
    status: r.status as Product["status"],
    qrCode: (r.qr_code as string) ?? undefined,
    verified: r.verified as boolean,
    blockchainTxHash: (r.blockchain_tx_hash as string) ?? undefined,
    blockchainBlock: (r.blockchain_block as number) ?? undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }
}

export function productToDB(p: Product) {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    batch_number: p.batchNumber,
    category: p.category,
    quantity: p.quantity,
    unit: p.unit,
    expiry_date: p.expiryDate,
    manufacturing_date: p.manufacturingDate,
    supplier_id: p.supplierId,
    supplier_name: p.supplierName,
    description: p.description ?? null,
    price: p.price,
    status: p.status,
    qr_code: p.qrCode ?? null,
    verified: p.verified,
    blockchain_tx_hash: p.blockchainTxHash ?? null,
    blockchain_block: p.blockchainBlock ?? null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }
}

export function shipmentFromDB(r: Row): Shipment {
  return {
    id: r.id as string,
    shipmentNumber: r.shipment_number as string,
    fromId: r.from_id as string,
    fromName: r.from_name as string,
    fromRole: r.from_role as Shipment["fromRole"],
    toId: r.to_id as string,
    toName: r.to_name as string,
    toRole: r.to_role as Shipment["toRole"],
    products: r.products as ShipmentProduct[],
    status: r.status as Shipment["status"],
    dispatchDate: r.dispatch_date as string,
    estimatedArrival: r.estimated_arrival as string,
    actualArrival: (r.actual_arrival as string) ?? undefined,
    trackingNumber: r.tracking_number as string,
    notes: (r.notes as string) ?? undefined,
    temperature: (r.temperature as number) ?? undefined,
    verified: r.verified as boolean,
    blockchainTxHash: (r.blockchain_tx_hash as string) ?? undefined,
    blockchainBlock: (r.blockchain_block as number) ?? undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }
}

export function shipmentToDB(s: Shipment) {
  return {
    id: s.id,
    shipment_number: s.shipmentNumber,
    from_id: s.fromId,
    from_name: s.fromName,
    from_role: s.fromRole,
    to_id: s.toId,
    to_name: s.toName,
    to_role: s.toRole,
    products: s.products,
    status: s.status,
    dispatch_date: s.dispatchDate,
    estimated_arrival: s.estimatedArrival,
    actual_arrival: s.actualArrival ?? null,
    tracking_number: s.trackingNumber,
    notes: s.notes ?? null,
    temperature: s.temperature ?? null,
    verified: s.verified,
    blockchain_tx_hash: s.blockchainTxHash ?? null,
    blockchain_block: s.blockchainBlock ?? null,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }
}

export function eventFromDB(r: Row): TraceabilityEvent {
  return {
    id: r.id as string,
    productId: r.product_id as string,
    productName: r.product_name as string,
    eventType: r.event_type as TraceabilityEvent["eventType"],
    fromEntity: (r.from_entity as string) ?? undefined,
    toEntity: (r.to_entity as string) ?? undefined,
    location: (r.location as string) ?? undefined,
    timestamp: r.timestamp as string,
    userId: r.user_id as string,
    userName: r.user_name as string,
    userRole: r.user_role as TraceabilityEvent["userRole"],
    shipmentId: (r.shipment_id as string) ?? undefined,
    notes: (r.notes as string) ?? undefined,
    verified: r.verified as boolean,
    blockchainHash: (r.blockchain_hash as string) ?? undefined,
  }
}

export function eventToDB(e: TraceabilityEvent) {
  return {
    id: e.id,
    product_id: e.productId,
    product_name: e.productName,
    event_type: e.eventType,
    from_entity: e.fromEntity ?? null,
    to_entity: e.toEntity ?? null,
    location: e.location ?? null,
    timestamp: e.timestamp,
    user_id: e.userId,
    user_name: e.userName,
    user_role: e.userRole,
    shipment_id: e.shipmentId ?? null,
    notes: e.notes ?? null,
    verified: e.verified,
    blockchain_hash: e.blockchainHash ?? null,
  }
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function loadProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) { console.error("loadProducts:", error.message); return MOCK_PRODUCTS }
  if (!data.length) {
    await supabase.from("products").insert(MOCK_PRODUCTS.map(productToDB))
    return MOCK_PRODUCTS
  }
  return data.map(productFromDB)
}

export async function upsertProduct(p: Product) {
  const { error } = await supabase.from("products").upsert(productToDB(p))
  if (error) console.error("upsertProduct:", error.message)
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) console.error("deleteProduct:", error.message)
}

// ── Shipments ─────────────────────────────────────────────────────────────────

export async function loadShipments(): Promise<Shipment[]> {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) { console.error("loadShipments:", error.message); return MOCK_SHIPMENTS }
  if (!data.length) {
    await supabase.from("shipments").insert(MOCK_SHIPMENTS.map(shipmentToDB))
    return MOCK_SHIPMENTS
  }
  return data.map(shipmentFromDB)
}

export async function upsertShipment(s: Shipment) {
  const { error } = await supabase.from("shipments").upsert(shipmentToDB(s))
  if (error) console.error("upsertShipment:", error.message)
}

// ── Traceability Events ───────────────────────────────────────────────────────

export async function loadEvents(): Promise<TraceabilityEvent[]> {
  const { data, error } = await supabase
    .from("traceability_events")
    .select("*")
    .order("timestamp", { ascending: true })
  if (error) { console.error("loadEvents:", error.message); return MOCK_TRACEABILITY }
  if (!data.length) {
    await supabase.from("traceability_events").insert(MOCK_TRACEABILITY.map(eventToDB))
    return MOCK_TRACEABILITY
  }
  return data.map(eventFromDB)
}

export async function upsertEvent(e: TraceabilityEvent) {
  const { error } = await supabase.from("traceability_events").upsert(eventToDB(e))
  if (error) console.error("upsertEvent:", error.message)
}

// ── Inventory ─────────────────────────────────────────────────────────────────

const INVENTORY_SEED: Record<string, ShipmentProduct[]> = {
  "user-002": [
    { productId: "prod-019", productName: "Epinephrine Auto-Injector", sku: "MX-PH-EPI-001", batchNumber: "BT-2025-0089", quantity: 20 },
    { productId: "prod-024", productName: "Defibrillator Pads Adult", sku: "MX-CL-DP-ADU", batchNumber: "BT-2025-0145", quantity: 30 },
  ],
}

export async function loadInventory(): Promise<Record<string, ShipmentProduct[]>> {
  const { data, error } = await supabase.from("inventory").select("*")
  if (error) { console.error("loadInventory:", error.message); return INVENTORY_SEED }
  if (!data.length) {
    await supabase.from("inventory").insert(
      INVENTORY_SEED["user-002"].map((item) => ({
        user_id: "user-002",
        product_id: item.productId,
        product_name: item.productName,
        sku: item.sku,
        batch_number: item.batchNumber,
        quantity: item.quantity,
        updated_at: new Date().toISOString(),
      }))
    )
    return INVENTORY_SEED
  }
  const result: Record<string, ShipmentProduct[]> = {}
  for (const row of data) {
    if (!result[row.user_id]) result[row.user_id] = []
    result[row.user_id].push({
      productId: row.product_id,
      productName: row.product_name,
      sku: row.sku,
      batchNumber: row.batch_number,
      quantity: row.quantity,
    })
  }
  return result
}

export async function syncInventory(userId: string, items: ShipmentProduct[]) {
  const { error: delErr } = await supabase.from("inventory").delete().eq("user_id", userId)
  if (delErr) { console.error("syncInventory delete:", delErr.message); return }
  if (!items.length) return
  const { error: insErr } = await supabase.from("inventory").insert(
    items.map((item) => ({
      user_id: userId,
      product_id: item.productId,
      product_name: item.productName,
      sku: item.sku,
      batch_number: item.batchNumber,
      quantity: item.quantity,
      updated_at: new Date().toISOString(),
    }))
  )
  if (insErr) console.error("syncInventory insert:", insErr.message)
}

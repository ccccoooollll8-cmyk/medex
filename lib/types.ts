export type UserRole = "supplier" | "distributor" | "provider" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  batchNumber: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  expiryDate: string;
  manufacturingDate: string;
  supplierId: string;
  supplierName: string;
  description?: string;
  price: number;
  status: "active" | "recalled" | "expired" | "low_stock";
  qrCode?: string;
  verified: boolean;
  blockchainTxHash?: string;
  blockchainBlock?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | "Surgical Supplies"
  | "Pharmaceuticals"
  | "Diagnostic Equipment"
  | "PPE"
  | "IV Supplies"
  | "Wound Care"
  | "Respiratory"
  | "Orthopedics"
  | "Cardiology"
  | "Laboratory";

export interface Shipment {
  id: string;
  shipmentNumber: string;
  fromId: string;
  fromName: string;
  fromRole: UserRole;
  toId: string;
  toName: string;
  toRole: UserRole;
  products: ShipmentProduct[];
  status: ShipmentStatus;
  dispatchDate: string;
  estimatedArrival: string;
  actualArrival?: string;
  trackingNumber: string;
  notes?: string;
  temperature?: number;
  verified: boolean;
  blockchainTxHash?: string;
  blockchainBlock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentProduct {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  batchNumber: string;
}

export type ShipmentStatus =
  | "pending"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "accepted"
  | "rejected";

export interface TraceabilityEvent {
  id: string;
  productId: string;
  productName: string;
  eventType: TraceabilityEventType;
  fromEntity?: string;
  toEntity?: string;
  location?: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  shipmentId?: string;
  notes?: string;
  verified: boolean;
  blockchainHash?: string;
}

export type TraceabilityEventType =
  | "manufactured"
  | "quality_check"
  | "dispatched"
  | "received"
  | "transferred"
  | "delivered"
  | "used"
  | "recalled";

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface KPIData {
  totalProducts: number;
  activeShipments: number;
  lowStockAlerts: number;
  verifiedTransactions: number;
  inventoryValue: number;
  shipmentsThisMonth: number;
  onTimeDeliveryRate: number;
  supplierCount: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface SupplyRiskAlert {
  id: string;
  productId: string;
  productName: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskType: "stock_depletion" | "expiry" | "supplier_delay" | "demand_spike";
  message: string;
  daysUntilCritical: number;
  recommendation: string;
  createdAt: string;
}

export interface WarehouseStock {
  productId: string;
  productName: string;
  sku: string;
  distributorId: string;
  quantity: number;
  location: string;
  lastUpdated: string;
}

"use client"

import { Truck, Send } from "lucide-react"
import { ShipmentList } from "@/components/shipments/shipment-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DistributorShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Shipments</h1>
          <p className="text-muted-foreground text-sm">Manage incoming stock and track dispatches to providers</p>
        </div>
      </div>

      <Tabs defaultValue="incoming">
        <TabsList>
          <TabsTrigger value="incoming" className="gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Incoming from Supplier
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="gap-1.5">
            <Send className="h-3.5 w-3.5" /> Dispatched to Provider
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-4">
          <ShipmentList canCreate={false} canAccept={true} role="distributor" />
        </TabsContent>

        <TabsContent value="outgoing" className="mt-4">
          <ShipmentList canCreate={true} canAccept={false} role="distributor_outgoing" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

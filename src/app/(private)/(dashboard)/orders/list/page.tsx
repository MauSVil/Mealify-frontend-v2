'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreparingOrders from "./_components/PreparingOrders";
import ReadyToDeliver from "./_components/ReadyToDeliver";

const OrdersListPage = () => {
  return (
    <Tabs defaultValue="preparing" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="preparing" className="flex-1">Preparando</TabsTrigger>
        <TabsTrigger value="ready_for_pickup" className="flex-1">Listas</TabsTrigger>
      </TabsList>
      <TabsContent value="preparing">
        <PreparingOrders />
      </TabsContent>
      <TabsContent value="ready_for_pickup">
        <ReadyToDeliver />
      </TabsContent>
    </Tabs>
  )
}

export default OrdersListPage
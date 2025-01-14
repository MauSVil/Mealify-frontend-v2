'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreparingOrders from "./_components/PreparingOrders";

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
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}

export default OrdersListPage
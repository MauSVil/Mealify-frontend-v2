'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreparingOrders from "./_components/PreparingOrders";
import ReadyToDeliver from "./_components/ReadyToDeliver";
import PendingOrders from "./_components/PendingOrders";
import { useOrders } from "./_hooks/useOrders";
import useSocket from "@/hooks/useSocket";

const OrdersListPage = () => {
  const { ordersQuery } = useOrders();
  
  const pendingOrders = (ordersQuery.data?.filter(order => order.status === 'pending' || order.status === 'restaurant_delayed') || []).length;
  const preparingOrders = (ordersQuery.data?.filter(order => order.status === 'preparing') || []).length;
  const readyForPickupOrders = (ordersQuery.data?.filter(order => order.status === 'ready_for_pickup' ||  order.status === 'in_progress') || []).length;

  useSocket('message', () => {
    ordersQuery.refetch();
  })

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="pending" className="flex-1">Pendiente ({pendingOrders})</TabsTrigger>
        <TabsTrigger value="preparing" className="flex-1">Preparando ({preparingOrders})</TabsTrigger>
        <TabsTrigger value="ready_for_pickup" className="flex-1">Listas ({readyForPickupOrders})</TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        <PendingOrders />
      </TabsContent>
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
import { useMutation, useQuery } from "@tanstack/react-query"
import { useApi } from "../../../../../../../lib/api"
import { useBusiness } from "@/contexts/BusinessContext";
import { Order } from "@/types/Order.type";

export const useOrders = () => {
  const api = useApi();
  const { activeBusiness } = useBusiness();

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["orders", activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get('/orders/restaurant/all');
      return resp.data;
    },
  })

  const updateOrder = useMutation({
    mutationKey: ["orders", "update"],
    mutationFn: async (order: Partial<Order>) => {
      const resp = await api.put(`/orders`, order);
      return resp.data;
    },
  })

  return {
    ordersQuery,
    updateOrder,
  }
}
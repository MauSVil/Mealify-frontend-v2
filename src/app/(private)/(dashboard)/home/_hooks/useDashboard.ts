import { useBusiness } from "@/contexts/BusinessContext"
import { useQuery } from "@tanstack/react-query"
import { useApi } from "../../../../../../lib/api";
import { Order } from "@/types/Order.type";

export const useDashboard = () => {
  const { activeBusiness } = useBusiness();
  const api = useApi();

  const totalQuery = useQuery<number>({
    queryKey: ["total", activeBusiness.id],
    queryFn: async () => {
      const resp = await api.get('/restaurants/totals');
      return resp.data;
    }
  })

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["orders", "dashboard", activeBusiness.id],
    queryFn: async () => {
      const resp = await api.get('/restaurants/orders');
      return resp.data;
    }
  })

  return {
    totalQuery,
    ordersQuery,
  }
}
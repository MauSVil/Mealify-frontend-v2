import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../../../../../lib/api";
import { useBusiness } from "@/contexts/BusinessContext";
import { Product } from "@/types/Product.type";
import { toast } from "sonner";

export const useProducts = () => {
  const api = useApi();
  const { activeBusiness } = useBusiness();

  const productsQuery = useQuery<Product[]>({
    queryKey: ["products", activeBusiness.id],
    queryFn: async () => {
      const { data } = await api.get(`/products/restaurant/${activeBusiness.id}`);
      return data;
    },
  })

  const modifiedProductsMutation = useMutation({
    mutationKey: ["products", activeBusiness.id],
    mutationFn: async (body: Record<string, boolean>) => {
      const parsedBody = Object.entries(body).map(([id, is_available]) => ({ id, is_available }));
      const res = await api.put('/products', parsedBody);
      return res.data;
    },
    onSuccess: () => {
      productsQuery.refetch();
      toast.success('Productos actualizados correctamente');
    }
  })

  return {
    productsQuery,
    modifiedProductsMutation
  };
}
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../../../../../lib/api";
import { useBusiness } from "@/contexts/BusinessContext";
import { Product } from "@/types/Product.type";

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

  return { productsQuery };
}
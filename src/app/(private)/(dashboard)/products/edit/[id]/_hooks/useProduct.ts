import { Product } from "@/types/Product.type";
import { useQuery } from "@tanstack/react-query"
import { useApi } from "../../../../../../../../lib/api";

export const useProduct = (id: string) => {
  const api = useApi();

  const productQuery = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const resp = await api.get(`/products/${id}`);
      return resp.data;
    }
  });

  return {
    productQuery
  }
}
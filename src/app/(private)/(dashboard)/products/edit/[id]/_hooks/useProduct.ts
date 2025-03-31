import { Product } from "@/types/Product.type";
import { useMutation, useQuery } from "@tanstack/react-query"
import { useApi } from "../../../../../../../../lib/api";
import { useBusiness } from "@/contexts/BusinessContext";

export const useProduct = (id: string) => {
  const api = useApi();
  const { activeBusiness } = useBusiness();  

  const productsQuery = useQuery<Product[]>({
    queryKey: ["products", activeBusiness.id],
    queryFn: async () => {
      const { data } = await api.get(`/products`);
      return data;
    },
  })

  const productQuery = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const resp = await api.get(`/products/${id}`);
      return resp.data;
    }
  });

  const updateProductMutation = useMutation<Product, unknown, FormData>({
    mutationKey: ['product', id],
    mutationFn: async (formData) => {
      const resp = await api.put(`/products/${id}`, formData);
      return resp.data;
    },
    onSettled: () => {
      productsQuery.refetch();
    }
  })

  return {
    productQuery,
    updateProductMutation
  }
}
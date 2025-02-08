import { Product } from "@/types/Product.type";
import { useMutation, useQuery } from "@tanstack/react-query"
import { useApi } from "../../../../../../../../lib/api";
import { useProducts } from "../../../list/_hooks/useProducts";

export const useProduct = (id: string) => {
  const api = useApi();
  const { productsQuery } = useProducts();

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
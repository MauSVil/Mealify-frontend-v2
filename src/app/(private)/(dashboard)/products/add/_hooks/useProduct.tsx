import { useMutation } from "@tanstack/react-query"
import { useApi } from "../../../../../../../lib/api";

export const useProduct = () => {
  const api = useApi();
  
  const addProductMutation = useMutation({
    mutationKey: ["addProduct"],
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/products', formData);
      return response.data;
    }
  })

  return {
    addProductMutation
  }
}
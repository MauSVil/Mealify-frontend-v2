import { useMutation } from "@tanstack/react-query"
import { useApi } from "../../../../../../lib/api";
import { useBusiness as useBusinessContext } from "@/contexts/BusinessContext";

export const useBusiness = () => {
  const api = useApi();
  const { refetchBusinesses } = useBusinessContext();

  const businessMutation = useMutation({
    mutationKey: ['business'],
    onMutate: async (formData: FormData) => {
      const { data } = await api.post('/restaurants', formData);
      refetchBusinesses();
      return data
    },
  })

  return {
    businessMutation,
  }
}
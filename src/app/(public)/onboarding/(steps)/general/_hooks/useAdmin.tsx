import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../../../../../../lib/api";
import { Admin } from "@/types/Admin.type";

export const useAdmin = () => {
  const api = useApi();

  const getAminQuery = useQuery<Admin>({
    queryKey: ["getAdmin"],
    queryFn: async () => {
      const { data } = await api.get('/admin')
      return data;
    }
  })

  const editAdminMutation = useMutation({
    mutationKey: ["editAdmin"],
    mutationFn: async (values: Partial<Admin>) => {
      const { data } = await api.put('/admin', values);
      return data;
    }
  })

  return {
    editAdminMutation,
    getAminQuery
  }
};
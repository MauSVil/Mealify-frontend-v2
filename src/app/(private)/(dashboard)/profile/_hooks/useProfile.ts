import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../../../../../../lib/api";
import { useBusiness } from "@/contexts/BusinessContext";
import { Admin } from "@/types/Admin.type";

interface Transfer {
  id: string;
  amount: number;
  created: number;
}


export const useProfile = () => {
  const api = useApi();
  const { activeBusiness } = useBusiness();

  const getAminQuery = useQuery<Admin>({
    queryKey: ["getAdmin"],
    queryFn: async () => {
      const { data } = await api.get('/admin')
      return data;
    }
  })

  const accountQuery = useQuery({
    queryKey: ["account", activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get('/stripe/account');
      return resp.data;
    }
  })

  const transfersQuery = useQuery<Transfer[]>({
    queryKey: ["transfers", activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.post('/stripe/transfers', { acct: "acct_1QZQmUBNDZohtlnW" });
      return resp.data;
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
    transfersQuery,
    accountQuery,
    getAminQuery,

    editAdminMutation
  }
};
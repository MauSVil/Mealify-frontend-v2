import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../../../../../lib/api";
import { useBusiness } from "@/contexts/BusinessContext";

interface Transfer {
  id: string;
  amount: number;
  created: number;
}


export const useProfile = () => {
  const api = useApi();
  const { activeBusiness } = useBusiness();
  

  const transfersQuery = useQuery<Transfer[]>({
    queryKey: ["transfers", activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.post('/stripe/transfers', { acct: "acct_1QZQmUBNDZohtlnW" });
      return resp.data;
    }
  })

  return {
    transfersQuery
  }
};
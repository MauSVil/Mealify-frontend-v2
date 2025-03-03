import { useQuery } from "@tanstack/react-query"
import { useApi } from "../../../../../lib/api";
import { Restaurant } from "@/types/Restaurant.type";
import { useUser } from "@clerk/nextjs";

export const useBusinesses = () => {
  const api = useApi();
  const { user } = useUser();

  const businessesQuery = useQuery<Restaurant[]>({
    queryKey: ["businesses", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      const resp = await api.get('/restaurants/admin');
      return resp.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!user?.id
  })

  return {
    businessesQuery
  }
}
import { useBusinesses } from '@/app/(private)/(dashboard)/_hooks/useBusinesses';
import { getSocket } from '@/lib/socket';
import { Restaurant } from '@/types/Restaurant.type';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export const BusinessContext = createContext<{
  businesses: Restaurant[],
  refetchBusinesses: () => void,
  isLoading: boolean,
  activeBusiness: Restaurant,
  setActiveBusiness: (business: Restaurant) => void,
}>({
  businesses: [],
  refetchBusinesses: () => {},
  isLoading: false,
  activeBusiness: {} as Restaurant,
  setActiveBusiness: () => {},
});

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [activeBusiness, setActiveBusiness] = useState<Restaurant>({} as Restaurant);
  const [businesses, setBusinesses] = useState<Restaurant[]>([]);
  const { businessesQuery } = useBusinesses();

  useEffect(() => {
    if (businessesQuery.data) {
      setBusinesses(businessesQuery.data);
      setActiveBusiness(businessesQuery.data[0]);
      const socket = getSocket();
      for (const business of businessesQuery.data) {
        console.log('joining room', business.id);
        socket.emit("message", { type: "joinRoom", roomId: `business_${business.id!}` });
      }
    }
  }, [businessesQuery.data, businessesQuery.isFetched]);

  const refetchBusinesses = () => {
    businessesQuery.refetch();
  }

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        refetchBusinesses,
        isLoading: businessesQuery.isLoading || businessesQuery.isFetching,
        setActiveBusiness,
        activeBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  return useContext(BusinessContext);
};
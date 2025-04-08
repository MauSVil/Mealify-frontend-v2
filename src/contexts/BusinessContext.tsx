import { useBusinesses } from '@/app/(private)/(dashboard)/_hooks/useBusinesses';
import { Restaurant } from '@/types/Restaurant.type';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export const BusinessContext = createContext<{
  businesses: Restaurant[],
  refetchBusinesses: () => void,
  isLoading: boolean,
  activeBusiness: Restaurant,
  setActiveBusiness: (business: Restaurant) => void,
  lock: boolean,
  setLock: (lock: boolean) => void,
}>({
  businesses: [],
  refetchBusinesses: () => {},
  isLoading: false,
  activeBusiness: {} as Restaurant,
  setActiveBusiness: () => {},
  lock: false,
  setLock: () => {},
});

const activeBusinessId = localStorage.getItem('activeBusiness');

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [activeBusiness, setActiveBusiness] = useState<Restaurant>({} as Restaurant);
  const [businesses, setBusinesses] = useState<Restaurant[]>([]);
  const [lock, setLock] = useState(false);
  const { businessesQuery } = useBusinesses();

  useEffect(() => {
    if (businessesQuery.data) {
      setBusinesses(businessesQuery.data);
    }
    if (activeBusinessId) {
      const business = businessesQuery.data?.find(b => b.id === Number(activeBusinessId));
      if (business) {
        setActiveBusiness(business);
      }
    } else {
      const firstBusiness = businessesQuery.data?.[0];
      if (firstBusiness) {
        setActiveBusiness(firstBusiness);
      }
    }
  }, [businessesQuery.data, businessesQuery.isFetched]);

  useEffect(() => {
    if (activeBusiness) {
      localStorage.setItem('activeBusiness', activeBusiness.id?.toString() || '');
    }
  }, [activeBusiness]);

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
        lock,
        setLock,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  return useContext(BusinessContext);
};
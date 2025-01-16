'use client';

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import ModalContainer from 'react-modal-promise';
import { BusinessProvider } from "./contexts/BusinessContext";

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <BusinessProvider>
          <ModalContainer />
          {children}
        </BusinessProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
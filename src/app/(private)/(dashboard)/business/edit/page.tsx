"use client"

import BusinessForm from "@/components/BusinessForm";
import { useBusiness } from "@/contexts/BusinessContext";

const BusinessEditPage = () => {
  const { activeBusiness } = useBusiness();

  const handleFormSubmit = async () => {
  };

  return (
    <BusinessForm
      label="Guardar"
      title="Edita tu negocio"
      handleSubmit={handleFormSubmit}
      // loading={businessMutation.isPending}
      loading={false}
      business={activeBusiness}
    />
  );
}

export default BusinessEditPage;
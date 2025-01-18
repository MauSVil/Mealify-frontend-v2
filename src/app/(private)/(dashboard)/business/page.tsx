'use client';

import BusinessForm from "@/components/BusinessForm";
import { useBusiness } from "@/hooks/common/useBusiness";

const BusinessPage = () => {
  const { businessMutation } = useBusiness();

  const handleFormSubmit = async (data: FormData) => {
    await businessMutation.mutateAsync(data);
  }

  return (
    <BusinessForm
      routeTo="/onboarding/general"
      handleSubmit={handleFormSubmit}
      loading={businessMutation.isPending}
    />
  );
}

export default BusinessPage;
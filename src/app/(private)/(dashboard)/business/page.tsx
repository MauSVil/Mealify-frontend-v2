'use client';

import BusinessForm from "@/components/BusinessForm";
import { useBusiness } from "@/hooks/common/useBusiness";

const BusinessPage = () => {
  const { businessMutation } = useBusiness();
  return <BusinessForm routeTo="/onboarding/general" mutation={businessMutation} />
}

export default BusinessPage;
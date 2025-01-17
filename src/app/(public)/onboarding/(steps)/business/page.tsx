'use client'

import BusinessForm from "@/components/BusinessForm";
import { useBusiness } from "@/hooks/common/useBusiness";

const OnboardingStepsBusinessPage = () => {
  const { businessMutation } = useBusiness();
  return <BusinessForm routeTo="/home" mutation={businessMutation} />
}

export default OnboardingStepsBusinessPage;
'use client'

import BusinessForm from "@/components/BusinessForm";
import { useBusiness } from "@/hooks/common/useBusiness";

const OnboardingStepsBusinessPage = () => {
  const { businessMutation } = useBusiness();

  const handleSubmit = async (formData: FormData) => {
    await businessMutation.mutateAsync(formData);
  }

  return (
    <BusinessForm
      routeTo="/onboarding/stripe"
      handleSubmit={handleSubmit}
      loading={businessMutation.isPending}
      label="Guardar y continuar"
    />
  )
}

export default OnboardingStepsBusinessPage;
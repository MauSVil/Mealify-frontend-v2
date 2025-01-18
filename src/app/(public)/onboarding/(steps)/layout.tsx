'use client';

import { OnboardingCloseConfirmationModal } from "@/components/modals/OnboardingCloseConfirmation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAdmin } from "./general/_hooks/useAdmin";

const OnboardingStepsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const path = usePathname();

  const { getAminQuery } = useAdmin();

  useEffect(() => {
    if (!getAminQuery.data?.onboarding_finished) return;
    router.push('/home');
  }, [router, getAminQuery.data?.onboarding_finished])

  if (getAminQuery.isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 size={32} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 w-full p-5 box-border">
      <div className="flex justify-between items-center mb-10">
        <Button
          variant={"default"}
          size={"icon"}
          onClick={async () => {
            if (path === '/onboarding/general') {
              await OnboardingCloseConfirmationModal();
              router.push('/home');
              return;
            }
            router.back();
          }}
        >
          {path === '/onboarding/general' ? <X /> : <ArrowLeft />}
        </Button>
      </div>
      {children}
    </div>
  );
}

export default OnboardingStepsLayout;
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const OnboardingStepsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="w-screen h-screen p-5">
      <div className="flex justify-between items-center mb-10">
        <Button
          variant={"default"}
          size={"icon"}
          onClick={() => {
            if (path === '/onboarding/general') {
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
'use client';

import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { loadConnectAndInitialize, StripeConnectInstance } from "@stripe/connect-js";
import { useState } from "react";
import { useApi } from "../../../../../../lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../general/_hooks/useAdmin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const OnboardingStripePage = () => {
  const api = useApi();
  const router = useRouter();

  const { editAdminMutation } = useAdmin();

  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | undefined>(undefined);
  const [stripeId, setStripeId] = useState<string | undefined>(undefined);

  const fetchClientSecret = async () => {
    const { data } = await api.post('/stripe/create-session');
    if (!data?.client_secret) {
      console.error('An error occurred');
      return undefined;
    }

    setStripeId(data?.id);

    return data.client_secret;
  }

  const handleFillStripeData = async () => {
    const lCAI = loadConnectAndInitialize({
      publishableKey: "pk_test_51QZ127BV9Ssjkt8CDD9ItTLsYfKNLGoysndPkhWkuTtPc5QgqlsGr9TpBAnQaTnEEX4GeENYN7eojTJUFMmz0bZA0091VEfYa2",
      fetchClientSecret: fetchClientSecret,
      locale: "es",
    })

    setStripeConnectInstance(lCAI);
  }

  return (
    <div className="flex items-center justify-center">
      {
        stripeConnectInstance ? (
          <div className="w-1/2 flex flex-col items-center">
            <Alert variant={"default"} className="mb-5">
              <AlertTitle>Atención</AlertTitle>
              <AlertDescription>
                Para poder continuar con el proceso de onboarding, es necesario que completes la información de tu cuenta de stripe.
                Esto te permitirá recibir pagos de tus clientes.
              </AlertDescription>
            </Alert>
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                onExit={async () => {
                  await editAdminMutation.mutateAsync({ stripe_account: stripeId, onboarding_finished: true  })
                  router.push('/profile');
                }}
                collectionOptions={{
                  futureRequirements: 'include',
                  fields: 'currently_due'
                }}
              />
            </ConnectComponentsProvider>
          </div>
        ) : (
          <Button onClick={() => handleFillStripeData()}>
            Llenar datos de stripe
          </Button>
        )
      }
    </div>
  );
}

export default OnboardingStripePage;
'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useBusiness } from "@/contexts/BusinessContext";
import { Loader2 } from "lucide-react";
import useSocket from "@/hooks/useSocket";
import { toast } from "sonner";
import { useAdmin } from "@/app/(public)/onboarding/(steps)/general/_hooks/useAdmin";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const router = useRouter();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    setAudio(new Audio('/sounds/notification.mp3'));
  }, []);

  const { getAminQuery } = useAdmin();
  const { businesses, isLoading } = useBusiness();

  const content = useMemo(() => {
    if (path === "/business") {
      return children
    }

    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          Loading...
        </div>
      )
    }

    if (!getAminQuery.data?.onboarding_finished) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h3 className="text-lg font-semibold">
            Antes de continuar, por favor completa tu perfil
          </h3>
          <Button onClick={() => router.push("/onboarding/general")}>
            Completar
          </Button>
        </div>
      )
    }

    if (businesses.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div>No se encontraron negocios</div>
          <Button onClick={() => router.push("/business")}>
            Crear un negocio
          </Button>
        </div>
      )
    }

    return children
  }, [businesses, children, path, router, isLoading, getAminQuery])

  const status = useMemo(() => {
    if (getAminQuery.isLoading || getAminQuery.isRefetching) {
      return <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
    }

    switch (getAminQuery.data?.stripe_status) {
      case 'success':
        return <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
      case 'error':
        return <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
      default:
        return <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse" />
    }
  }, [getAminQuery.data?.stripe_status, getAminQuery.isLoading, getAminQuery.isRefetching])

  useSocket('new-order', () => {
    toast.info('Nueva orden');
    if (audio) {
      audio.play().catch((err) => {
        console.error('Error reproduciendo el audio:', err);
      });
    }
  })

  return (
    <SidebarProvider>
      <AppSidebar businesses={businesses} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {
              getAminQuery.data?.onboarding_finished && (
                <Button
                  variant={"outline"}
                  className="flex gap-2"
                >
                  {status}
                  Ir a dashboard de Stripe
                </Button>
              )
            }
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout;


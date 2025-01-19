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
import { useApi } from "../../../../lib/api";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const router = useRouter();
  const api = useApi();

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
  }, [businesses, children, path, router, isLoading])

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
          </div>
          <div className="px-4 flex flex-row items-center gap-2">
            {
              getAminQuery.data?.stripe_status === 'success' ? (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <p>
                    Puede recibir pagos
                  </p>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                  <p>
                    No puede recibir pagos
                  </p>
                  <Button
                    onClick={async () => {
                      try {
                        const { data } = await api.get('/stripe/generate-sign-in-link');
                        console.log({ data });
                        window.open(data.url.link, '_blank');
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    Corregir
                  </Button>
                </>
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


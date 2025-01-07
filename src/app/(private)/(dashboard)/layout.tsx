'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
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

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const router = useRouter();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    // Configurar audio solo en el cliente
    setAudio(new Audio('/sounds/notification.mp3'));
  }, []);

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


  useSocket('new-order', (data) => {
    console.log(data);
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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


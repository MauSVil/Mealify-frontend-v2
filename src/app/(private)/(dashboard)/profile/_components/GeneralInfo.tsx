'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProfile } from "../_hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, RefreshCwIcon } from "lucide-react";
import { useEffect } from "react";
import { useApi } from "../../../../../../lib/api";

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio').max(50, 'El nombre es muy largo'),
  first_last_name: z.string().min(2, 'El apellido es obligatorio').max(50, 'El apellido es muy largo'),
  second_last_name: z.string().min(2, 'El apellido es obligatorio').max(50, 'El apellido es muy largo'),
  phone: z.string().min(10, 'El teléfono es obligatorio').max(10, 'El teléfono es muy largo'),
})

const GeneralInfo = () => {
  const { accountQuery, getAminQuery, editAdminMutation } = useProfile();
  const api = useApi();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      first_last_name: "",
      second_last_name: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await editAdminMutation.mutateAsync(values);
      toast.success('Datos guardados correctamente');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error('Ocurrio un error inesperado');
    }
  }

  useEffect(() => {
      if (getAminQuery.data) {
        form.reset(getAminQuery.data);
      }
    }, [getAminQuery.data]);

  const handleCompleteInformationClick = async () => {
    const resp = await api.get('/stripe/generate-sign-in-link');
    window.open(resp.data.link.url, '_blank');
  }

  return (
    <div className="flex-1">
      {accountQuery?.data?.future_requirements?.disabled_reason || accountQuery?.data?.requirements?.disabled_reason && (
        <Alert variant={"destructive"} className="flex flex-col mb-5">
          <AlertTitle className="mb-3 font-bold">
            Hay acciones pendientes para poder recibir pagos
          </AlertTitle>
          <AlertDescription className="mb-3">
            Puede ser que se haya omitido información importante en tu cuenta de stripe. Por favor, completa la información requerida.
          </AlertDescription>
          <div className="flex gap-3">
            <Button
              className="self-end"
              variant={"outline"}
              onClick={handleCompleteInformationClick}
            >
              Completar información
            </Button>
            <Button size={"icon"} onClick={() => accountQuery.refetch()}>
              <RefreshCwIcon size={16} />
            </Button>
          </div>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
          <div className="flex gap-4 flex-row">
            <div className="bg-white shadow rounded-lg space-y-4 p-4 flex-1">
              <h1 className="text-2xl font-semibold">
                Información general
              </h1>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Escribe un nombre..." {...field} disabled={getAminQuery.isLoading || getAminQuery.isRefetching} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="first_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primer Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Escribe un primer apellido..." {...field} disabled={getAminQuery.isLoading || getAminQuery.isRefetching} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="second_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segundo Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Escribe un segundo apellido..." {...field} disabled={getAminQuery.isLoading || getAminQuery.isRefetching} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono celular</FormLabel>
                      <FormControl>
                        <Input placeholder="Escribe un telefono..." {...field} disabled={getAminQuery.isLoading || getAminQuery.isRefetching} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              disabled={editAdminMutation.isPending}
            >
              {editAdminMutation.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
};

export default GeneralInfo;
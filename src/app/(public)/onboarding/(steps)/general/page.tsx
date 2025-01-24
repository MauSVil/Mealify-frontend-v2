'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAdmin } from "./_hooks/useAdmin";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio').max(50, 'El nombre es muy largo'),
  first_last_name: z.string().min(2, 'El apellido es obligatorio').max(50, 'El apellido es muy largo'),
  second_last_name: z.string().min(2, 'El apellido es obligatorio').max(50, 'El apellido es muy largo'),
  phone: z.string().min(10, 'El teléfono es obligatorio').max(10, 'El teléfono es muy largo'),
})

const OnboardingGeneralPage = () => {
  const router = useRouter();

  const { editAdminMutation, getAminQuery } = useAdmin();

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
      if (!form.control._formState.isDirty) {
        router.push('/onboarding/stripe');
        return
      }
      await editAdminMutation.mutateAsync(values);
      toast.success('Datos guardados correctamente');
      router.push('/onboarding/stripe');
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
      const safeData = {
        name: getAminQuery.data.name || "",
        first_last_name: getAminQuery.data.first_last_name || "",
        second_last_name: getAminQuery.data.second_last_name || "",
        phone: getAminQuery.data.phone || "",
      };
      form.reset(safeData);
    }
  }, [getAminQuery.data, form]);

  return (
    <div className="flex">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
          <div className="flex gap-4 flex-row">
            <div className="bg-white shadow rounded-lg space-y-4 p-4 flex-1">
              <h1 className="text-2xl font-semibold">Queremos conocer mas de ti</h1>
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
              Guardar y continuar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default OnboardingGeneralPage;
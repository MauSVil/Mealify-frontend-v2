'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/ui/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProduct } from "./_hooks/useProduct";
import { useRouter } from "next/navigation";

const isClient = typeof window !== 'undefined';

const formSchema = z.object({
  name: z.string().min(1, { message: "Nombre es requerido" }),
  description: z.string().min(1, { message: "Descripcion es requerido" }),
  price: z.coerce.number().min(1, { message: "Precio es requerido" }),
  image: isClient
      ? z.instanceof(File).refine((file) => file.size < 5000000, {
          message: 'La imagen es muy grande',
        }).optional()
      : z.any().optional(),
});

const ProductsAddPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: undefined,
    },
  });
  const fileRef = useRef<HTMLInputElement>(null)

  const { addProductMutation } = useProduct();
  const router = useRouter();
  const { isMobile } = useSidebar()
  const { watch } = form;
  const image = watch('image');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price.toString());
      if (values.image) {
        formData.append('image', values.image);
      }
      await addProductMutation.mutate(formData);
      router.push('/products-list')
    }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-4/5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
              <div className="bg-white shadow rounded-lg space-y-4 p-4 flex-1">
                <h1 className="text-2xl font-semibold">
                  Agregar Producto
                </h1>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Escribe un nombre..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripcion</FormLabel>
                      <FormControl>
                        <Input placeholder="Escribe un descripcion..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Escribe un precio..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="bg-white shadow rounded-lg space-y-4 p-4 flex-1">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Portada</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            ref={fileRef}
                            placeholder="Selecciona una imagen..."
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              form.setValue('image', file as any)
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {image && (
                  <div className="h-full">
                    <div className="relative h-36 rounded-md flex justify-end">
                      <div
                        className="absolute bg-red-600 rounded-md w-4 h-4 z-10 -right-1 -top-1 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          form.setValue('image', undefined)
                          if (fileRef.current) {
                            fileRef.current.value = ''
                          }
                        }}
                      >
                        <p className="text-white text-xs font-semibold">X</p>
                      </div>
                      <Image src={URL.createObjectURL(image)} layout="fill" objectFit="cover" alt="image" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full justify-end">
              <Button type="submit">
                {addProductMutation.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
                Crear
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ProductsAddPage;
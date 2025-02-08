'use client';

import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { groupOptions, Product, productSchema } from "@/types/Product.type"
import { useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { cn } from "@/lib/utils";

const isClient = typeof window !== 'undefined';

interface ProductProps {
  routeTo?: string;
  handleSubmit: (values: FormData) => Promise<void>;
  loading: boolean;
  title: string;
  product?: Product;
  label?: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Nombre es requerido" }),
  description: z.string().min(1, { message: "Descripcion es requerido" }),
  price: z.coerce.number().min(1, { message: "Precio es requerido" }),
  image: isClient
      ? z.instanceof(File).refine((file) => file.size < 5000000, {
          message: 'La imagen es muy grande',
        }).optional()
      : z.any().optional(),
}).and(productSchema.pick({ group: true }));

const ProductForm = (props: ProductProps) => {
  const { routeTo = "/products/list", handleSubmit, title, loading, product, label = "Crear" } = props;

  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null)  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: undefined,
      group: groupOptions[0].value,
    },
  });

  const { watch } = form;

  const image = watch('image');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('group', values.group);
    if (values.image) {
      formData.append('image', values.image);
    }
    handleSubmit(formData);
    router.push(routeTo);
  }

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        image: undefined,
        group: product.group,
      })
    }
  }, [product])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
        <div className="flex gap-4 flex-row">
          <div className="bg-white shadow rounded-lg space-y-4 p-4 flex-1">
            <h1 className="text-2xl font-semibold">
              {title}
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
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Grupo</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? groupOptions.find(
                                (group) => group.value === String(field.value)
                              )?.label
                            : "Selecciona un grupo"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Busca un grupo..." />
                        <CommandList>
                          <CommandEmpty>
                            No hay resultados para la busqueda
                          </CommandEmpty>
                          <CommandGroup>
                            {groupOptions.map((group) => (
                              <CommandItem
                                value={group.label}
                                key={group.value}
                                onSelect={() => {
                                  form.setValue("group", group.value)
                                }}
                              >
                                {group.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    group.value === String(field.value)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
            {loading && <Loader2 className="animate-spin mr-2" size={16} />}
            {label}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm;
'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Autocomplete from "@/components/google/Autocomplete";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Restaurant } from "@/types/Restaurant.type";

const isClient = typeof window !== 'undefined';

const categories = [
  { value: 'Mexicana', label: 'Mexicana' },
  { value: 'Italiana', label: 'Italiana' },
  { value: 'China', label: 'China' },
  { value: 'Japonesa', label: 'Japonesa' },
  { value: 'Fast Food', label: 'Fast Food' },
]

const containerStyle = {
  width: "100%",
  height: "250px",
};

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio').max(50, 'El nombre es muy largo'),
  phone: z.string({ message: 'El telefono es obligatorio' }).min(10, 'El telefono es obligatorio').max(10, 'El telefono es muy largo'),
  category: z.enum(['Mexicana', 'Italiana', 'China', 'Japonesa', 'Fast Food']),
  delivery_fee: z.number().min(0, 'El costo de envio es obligatorio'),
  image: isClient
        ? z.union([z.string().url(), z.instanceof(File, { message: 'Debe de contener una imagen'}).refine((file) => file.size < 5000000, {
          message: 'La imagen es muy grande',
        })])
        : z.any(),
  address: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string()
  }),
})

interface BusinessProps {
  routeTo?: string;
  handleSubmit: (values: FormData) => Promise<void>;
  label?: string;
  loading: boolean;
  title?: string;
  business?: Restaurant;
}

const BusinessForm = (props: BusinessProps) => {
  const {
    routeTo,
    handleSubmit,
    label = "Crear",
    loading,
    title = 'Tu negocio',
    business
  } = props;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const router = useRouter()
  const [input, setInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      category: "Fast Food",
      delivery_fee: 10,
      address: {
        lat: 19.952178,
        lng: -99.534217,
        address: "",
      },
    },
  })

  const { watch } = form;
  const image = watch('image');
  const address = watch('address');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('phone', values.phone);
    formData.append('category', values.category);
    formData.append('delivery_fee', values.delivery_fee.toString());
    formData.append('latitude', values.address.lat.toString());
    formData.append('longitude', values.address.lng.toString());
    formData.append('address', values.address.address);
    if (values.image) {
      formData.append('image', values.image);
    }
    handleSubmit(formData);
    if (routeTo) router.push(routeTo);
  };

  const center = useMemo(() => {
    return {
      lat: address.lat,
      lng: address.lng,
    }
  }, [address.lat, address.lng])

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const { lat, lng } = event.latLng.toJSON();
  
      try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
  
        if (response.results && response.results[0]) {
          const address = response.results[0].formatted_address;  
          form.setValue('address', { lat, lng, address });
        } else {
          console.error('No address found for the selected location.');
          form.setValue('address', { lat, lng, address: '' });
        }
      } catch (error) {
        console.error('Error while fetching the address:', error);
        form.setValue('address', { lat, lng, address: '' });
      }
    }
  };

  useEffect(() => {
    if (business) {
      form.reset({
        name: business.name,
        phone: business.phone || '',
        category: 'Fast Food',
        delivery_fee: business.delivery_fee,
        address: {
          lat: Number(business.latitude),
          lng: Number(business.longitude),
          address: business.address,
        },
        image: business.hero_image_min,
      })
    }
  }, [business])

  return (
    <div className="flex">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
          <div className="flex gap-4 flex-row">
            <div className="bg-white shadow rounded-lg space-y-4 p-4 flex-1">
              <h1 className="text-2xl font-semibold">{title}</h1>
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="Escribe un telefono..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoria..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="delivery_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Costo de envio
                      <span className="text-gray-500 text-sm"> (MXN)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Tu costo de envio..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
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
                              form.setValue('image', file)
                            }}
                          />
                          {image && (
                            <div className="h-full">
                              <div className="relative w-8 h-8 rounded-md flex justify-end">
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
                                <Image src={typeof image === "string" ? image : URL.createObjectURL(image)} layout="fill" objectFit="cover" alt="image" />
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="bg-white shadow rounded-lg space-y-4 p-4 flex-1">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicacion</FormLabel>
                      <Autocomplete onChange={field.onChange} input={input} setInput={setInput} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoaded && !input && address.lat !== 0 && address.lng !== 0 && (
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15} onClick={handleMapClick} options={{ disableDefaultUI: true }}>
                  <Marker position={center} />
                </GoogleMap>
              )}
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin mr-2" size={16} />}
              {label}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default BusinessForm;
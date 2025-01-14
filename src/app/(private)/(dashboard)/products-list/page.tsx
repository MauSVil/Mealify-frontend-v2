'use client';

import { useProducts } from "./_hooks/useProducts"
import Image from 'next/image';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ProductsList = () => {
  const [query, setQuery] = useState('');
  const { productsQuery } = useProducts();
  const products = productsQuery.data || [];

  if (productsQuery.isError) toast.error(productsQuery.error.message);

  return (
    <>
      <Input placeholder="Buscar producto" onChange={(e) => setQuery(e.target.value)} value={query} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Disponibilidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products
          .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
          .map((product) => (
            <TableRow key={product.id}>
              <TableCell className="w-[80px] relative">
                <Image
                  src={product.image_min!}
                  layout="fill"
                  objectFit="cover"
                  alt="Product Image"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Switch checked={product.is_available} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ProductsList
'use client';

import _ from 'lodash';
import { useProducts } from "./_hooks/useProducts"
import Image from 'next/image';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import numeral from "numeral";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useApi } from "../../../../../../lib/api";
import { useRouter } from "next/navigation";
import { groupOptions } from '@/types/Product.type';

const ProductsList = () => {
  const api = useApi();
  const router = useRouter();
  const [productsModified, setProductsModified] = useState<Record<string, boolean>>({});

  const [query, setQuery] = useState('');
  const { productsQuery, modifiedProductsMutation } = useProducts();
  const products = useMemo(() => productsQuery.data || [], [productsQuery.data]);

  const productsFiltered = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  const groupedProducts = _.groupBy(productsFiltered, 'group');

  if (productsQuery.isError) toast.error(productsQuery.error.message);

  const handleDeleteProduct = async (productId: number) => {
    try {
      await ConfirmationModal({
        title: '¿Estás seguro de que deseas eliminar este producto?',
        cancelText: 'Cancelar',
        confirmationText: 'Eliminar',
      })
      await api.delete(`/products/${productId}`);
    } catch (err) {
      console.log('cancel delete product', err, productId);
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Input placeholder="Buscar producto" onChange={(e) => setQuery(e.target.value)} value={query} />
        {
          Object.keys(productsModified).length > 0 && (
            <Button
              onClick={async () => {
                await modifiedProductsMutation.mutateAsync(productsModified);
                setProductsModified({});
              }}
            >
              Aplicar cambios ({Object.keys(productsModified).length})
            </Button>
          )
        }
      </div>

      {Object.keys(groupedProducts).map((group) => (
        <div key={group} className="mt-4">
          <h2 className="text-xl font-bold">
            {groupOptions.find((option) => option.value === group)?.label}
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Imagen</TableHead>
                <TableHead className='max-w-36'>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Disponibilidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedProducts[group].map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="w-[80px] relative">
                    <Image
                      src={product.image_min!}
                      layout="fill"
                      objectFit="cover"
                      alt="Product Image"
                    />
                  </TableCell>
                  <TableCell className='max-w-36'>
                    <p className='truncate'>
                      {product.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    {numeral(product.price).format('$0,0.00')}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={
                        productsModified[product.id!] !== undefined
                          ? productsModified[product.id!]
                          : product.is_available
                      }
                      onCheckedChange={(checked) => setProductsModified((prev) => ({ ...prev, [product.id!]: checked }))}
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button size={"icon"} className="rounded-full" onClick={() => router.push(`/products/edit/${product.id}`)}>
                      <Edit size={10} />
                    </Button>
                    <Button size={"icon"} variant={"destructive"} className="rounded-full" onClick={() => handleDeleteProduct(product.id!)}>
                      <Trash size={10} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </>
  )
}

export default ProductsList
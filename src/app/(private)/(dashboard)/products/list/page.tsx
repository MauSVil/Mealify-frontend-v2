'use client';

import _ from 'lodash';
import Image from 'next/image';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, Edit, Loader2, Trash } from "lucide-react";
import numeral from "numeral";
import { groupOptions } from '@/types/Product.type';
import { useModule } from './_module/useModule';
import { useRouter } from 'next/navigation';

const ProductsList = () => {
  const router = useRouter();
  const { methods, localData, flags } = useModule();
  const { handleDeleteProduct, setProductsModified, setQuery, modifyProducts, handleImportProducts } = methods;
  const { productsModified, query, products } = localData;

  const productsFiltered = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  const groupedProducts = _.groupBy(productsFiltered, 'group');

  if (flags.isError) toast.error('Error al cargar los productos');

  return (
    <>
      <div className="flex gap-2">
        <Input placeholder="Buscar producto" onChange={(e) => setQuery(e.target.value)} value={query} />
        {
          Object.keys(productsModified).length > 0 && (
            <Button
              onClick={async () => {
                await modifyProducts(productsModified);
                setProductsModified({});
              }}
            >
              Aplicar cambios ({Object.keys(productsModified).length})
            </Button>
          )
        }
        <Button
          onClick={() => router.push('/products/add')}
        >
          <CirclePlus size={16} />
          Agregar producto
        </Button>
        <Button
          onClick={handleImportProducts}
          disabled={flags.isImporting}
        >
          {flags.isImporting && <Loader2 className="animate-spin mr-1" size={16} />}
          Importar productos
        </Button>
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
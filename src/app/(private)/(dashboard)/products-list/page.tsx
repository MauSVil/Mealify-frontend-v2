'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useProducts } from "./_hooks/useProducts"
import { DataTable2 } from '@/components/DataTable';
import { Product } from '@/types/Product.type';
import { useMemo, useState } from 'react';
import DataTableColumnHeader from '@/components/DataTableHeader';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { toast } from 'sonner';

const ProductsList = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('');
  const { productsQuery } = useProducts();
  const products = productsQuery.data || [];

  if (productsQuery.isError) toast.error(productsQuery.error.message);
  
  const columns: ColumnDef<Product>[] = useMemo(
    () =>
      [
        {
          id: 'image',
          accessorFn: (row) => row.image_min,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Imagen" />
          ),
          cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
              <>
                {value ? <Image src={value} width={40} height={40} alt='product-image' className='bg-slate-200' /> : '(Sin imagen)'}
              </>
            );
          },
        },
        {
          id: 'name',
          accessorFn: (row) => `${row.name}`,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nombre" />
          ),
          cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
              <>
                {value ? value : '(Sin nombre)'}
              </>
            );
          },
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
        {
          id: 'price',
          accessorFn: (row) => row.price,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Precio" />
          ),
          cell: ({ getValue }) => {
            const value = getValue() as number;
            return (
              <>
                {value ? `$${value}` : '(Sin precio)'}
              </>
            );
          },
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
        {
          id: 'active',
          accessorFn: (row) => row.is_available,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Disponibilidad" />
          ),
          cell: ({ getValue }) => {
            const value = getValue() as boolean;
            return <Switch checked={value} />;
          },
        }
      ] satisfies ColumnDef<Product>[],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getRowId(originalRow) {
      return originalRow.id!.toString();
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: "auto",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter
    },
  })

  return (
    <div className="flex flex-col gap-2">
      <DataTable2 table={table} columns={columns} isLoading={productsQuery.isLoading} />
    </div>
  )
}

export default ProductsList
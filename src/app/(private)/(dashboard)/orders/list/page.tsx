'use client';

import moment from "moment";
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { useOrders } from "./_hooks/useOrders"
import { useMemo, useState } from "react";
import { DataTable2 } from "@/components/DataTable";
import { Order } from "@/types/Order.type";
import DataTableColumnHeader from "@/components/DataTableHeader";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const OrdersListPage = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'created-at', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('');
  const { ordersQuery } = useOrders();

  const router = useRouter();

  const columns: ColumnDef<Order>[] = useMemo(
    () =>
      [
        {
          id: 'order-items',
          accessorFn: (row) => `${row.order_items?.length} item(s)`,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Items" />
          ),
        },
        {
          id: 'created-at',
          accessorFn: (row) => moment(row.created_at).format('DD/MM/YYYY: HH:mm'),
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha" />
          ),
        },
        {
          id: 'actions',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Acciones" />
          ),
          cell: ({ row }) => {
            return (
              <Button size="icon" onClick={() => router.push(`/orders/${row.original.id}`)}>
                <Eye size={14} />
              </Button>
            )
          }
        }
      ] satisfies ColumnDef<Order>[],
    []
  );

  const table = useReactTable({
      data: (ordersQuery.data || []).filter(order => order.status === 'preparing'),
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
      <DataTable2 table={table} columns={columns} isLoading={ordersQuery.isLoading} />
    </div>
  )
}

export default OrdersListPage
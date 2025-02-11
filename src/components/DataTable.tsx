'use client';

import { Table as TableType, flexRender } from '@tanstack/react-table';
import { CSSProperties, ReactNode } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData> {
  table: TableType<TData>;
  className?: string;
  error?: string;
  isFooterVisible?: boolean;
  style?: CSSProperties;
  emptyText?: string;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  idIncludeTo?: string[];
  columns: unknown[];
  otherItemsOnButtonsHeader?: ReactNode;
}

export function DataTable2<TData>({
  table,
  isLoading,
  columns,
}: DataTableProps<TData>) {

  return (
    <>
      <div className="rounded-md border">
        <Table className='p-2'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                // data-state={row.getIsSelected() && messages.app.pages.accounts.tables.main.helpers.selected}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

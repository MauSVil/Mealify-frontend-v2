'use client';

import moment from "moment"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useOrders } from "./_hooks/useOrders"
import Image from "next/image";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrdersListPage = () => {
  const { ordersQuery } = useOrders()

  return (
    <div className="flex flex-col gap-2 pr-10">
      <Accordion type="multiple" className="w-full">
        {ordersQuery.data?.filter(order => order.status === 'preparing').map((order) => (
          <AccordionItem key={order.id} value={String(order.id!)} className="mb-3">
            <AccordionTrigger className="bg-gray-100/70 px-2">
              <div className="flex w-full justify-between gap-1 pr-5">
                <span>
                  <strong>Fecha de creación: </strong>
                  {moment(order.created_at).format("DD/MM/YYYY")}
                </span>
                <span>
                  <strong>Productos: </strong>
                  {order.order_items?.length} producto(s)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Imagen</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items?.map((oI) => (
                    <TableRow key={oI.id}>
                      <TableCell className="w-[80px] relative">
                        <Image
                          src={oI.products.image_min}
                          layout="fill"
                          objectFit="cover"
                          alt="Product Image"
                        />
                      </TableCell>
                      <TableCell className="w-28">{oI.quantity}</TableCell>
                      <TableCell>{oI.products.name}</TableCell>
                      <TableCell>${oI.products.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">
                      ${order.total_price}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </AccordionContent>
          </AccordionItem>  
        ))}
      </Accordion>
    </div>
  )
}

export default OrdersListPage
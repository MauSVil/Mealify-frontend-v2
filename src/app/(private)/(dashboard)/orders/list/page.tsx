'use client';

import moment from "moment"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useOrders } from "./_hooks/useOrders"
import Image from "next/image";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const OrdersListPage = () => {
  const { ordersQuery } = useOrders()

  return (
    <div className="flex flex-col gap-2 pr-10">
      <Accordion type="multiple" className="w-full">
        {ordersQuery.data
        ?.filter(order => order.status === 'preparing')
        ?.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .map((order) => (
          <AccordionItem key={order.id} value={String(order.id!)} className="mb-3">
            <AccordionTrigger className="bg-gray-100/70 px-2">
              <div className="flex w-full justify-between gap-1 pr-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Fecha de creación: </span>
                  {moment(order.created_at).format("DD/MM/YYYY: HH:mm")}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Productos: </span>

                  {order.order_items?.length} producto(s)
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <>
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
                <div className="flex w-full justify-end">
                  <Button
                    variant={"success"}
                    size={"sm"}
                    className="mt-2"
                    onClick={() => {
                      console.log(order)
                    }}
                  >
                    Marcar como listo
                  </Button>
                </div>
              </>
            </AccordionContent>
          </AccordionItem>  
        ))}
      </Accordion>
    </div>
  )
}

export default OrdersListPage
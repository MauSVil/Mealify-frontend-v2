import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSocket from "@/hooks/useSocket"
import { Loader2 } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useOrders } from "../_hooks/useOrders"

const PreparingOrders = () => {
  const { ordersQuery, updateOrder } = useOrders();
  const [orderProcessing, setOrderProcessing] = useState<number | undefined>();

  useSocket('new-order', () => {
    ordersQuery.refetch();
  })

  const initialOpenValues = useMemo(() => {
    return ordersQuery.data?.map(order => String(order.id!)) || [];
  }, [ordersQuery.data]);

  const [openValues, setOpenValues] = useState(initialOpenValues);

  useEffect(() => {
    setOpenValues(initialOpenValues);
  }, [initialOpenValues]);

  const content = useMemo(() => {
    if (ordersQuery.isLoading) {
      return (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )
    }
    if (ordersQuery.data?.filter(o => o.status === 'preparing').length === 0) {
      return (
        <div className="h-96 flex items-center justify-center">
          No hay órdenes para preparar
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-2 pr-10">
        <Accordion type="multiple" className="w-full" value={openValues} onValueChange={(newValues) => setOpenValues(newValues)}>
          {ordersQuery.data
          ?.filter(order => order.status === 'preparing')
          ?.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
          .map((order) => (
            <AccordionItem key={String(order.id)} value={String(order.id!)} className="mb-3">
              <AccordionTrigger className="bg-gray-100/40 px-2 rounded-t-md">
                <div className="flex w-full justify-between gap-1 pr-5">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Fecha de creación: </span>
                    <div className="flex gap-1">
                      <Badge>
                        {moment(order.created_at).format("DD/MM/YYYY: HH:mm")}
                      </Badge>
                      <Badge variant={"outline"}>
                        {moment(order.created_at).fromNow()}
                      </Badge>
                    </div>
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
                          ${order.order_items?.reduce((acc, oI) => acc + Number(oI.unit_price) * oI.quantity, 0)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                  <div className="flex w-full justify-end">
                    <Button
                      variant={"success"}
                      size={"sm"}
                      className="mt-2"
                      disabled={updateOrder.isPending && orderProcessing === order.id}
                      onClick={async () => {
                        setOrderProcessing(order.id)
                        await updateOrder.mutateAsync({
                          id: order.id,
                          status: 'ready_for_pickup'
                        })
                        ordersQuery.refetch()
                        setOrderProcessing(undefined)
                      }}
                    >
                      {updateOrder.isPending && orderProcessing === order.id && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
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
  }, [ordersQuery.data]);

  return content;
}

export default PreparingOrders
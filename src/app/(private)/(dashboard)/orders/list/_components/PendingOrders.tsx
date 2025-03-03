import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSocket from "@/hooks/useSocket"
import { AlertCircle, Loader2 } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useOrders } from "../_hooks/useOrders"
import { getSocket } from "@/lib/socket"

const PendingOrders = () => {
  const { isSocketConnected } = getSocket();
  const { ordersQuery, updateOrder } = useOrders();
  const [orderProcessing, setOrderProcessing] = useState<number | undefined>();

  useSocket("new-order", () => ordersQuery.refetch());
  useSocket("message", () => ordersQuery.refetch());

  const [backupPolling, setBackupPolling] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSocketConnected) {
      if (backupPolling) {
        clearInterval(backupPolling);
        setBackupPolling(null);
      }
    } else {
      if (!backupPolling) {
        const interval = setInterval(() => {
          ordersQuery.refetch();
        }, 15000);
        setBackupPolling(interval);

        console.log("Backup polling started");
      }
    }

    return () => {
      if (backupPolling) {
        clearInterval(backupPolling);
      }
    };
  }, [isSocketConnected, backupPolling, ordersQuery]);

  const initialOpenValues = useMemo(() => {
    return ordersQuery.data?.map(order => String(order.id!)) || [];
  }, [ordersQuery.data]);

  const [openValues, setOpenValues] = useState(initialOpenValues);

  useEffect(() => {
    setOpenValues(initialOpenValues);
  }, [initialOpenValues]);

  const content = () => {
    if (ordersQuery.isLoading) {
      return (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      );
    }
    if (!ordersQuery.data?.some(o => o.status === 'pending' || o.status === 'restaurant_delayed')) {
      return (
        <div className="h-96 flex items-center justify-center">
          No hay órdenes pendientes
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-2 pr-10">
        <Accordion type="multiple" className="w-full" value={openValues} onValueChange={setOpenValues}>
          {ordersQuery.data
            .filter(o => o.status === 'pending' || o.status === 'restaurant_delayed')
            .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
            .map((order) => (
              <AccordionItem key={String(order.id)} value={String(order.id!)} className="mb-3">
                <AccordionTrigger className="bg-gray-100/40 px-2 rounded-t-md">
                  <div className="flex w-full justify-between gap-1 pr-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">Fecha de creación:</span>
                      <div className="flex gap-1">
                        <Badge>{moment(order.created_at).format("DD/MM/YYYY: HH:mm")}</Badge>
                        <Badge variant={"outline"}>{moment(order.created_at).fromNow()}</Badge>
                        {order.delay_date && (
                          <Badge variant={"destructive"}>
                            <div className="flex gap-1 items-center">
                              <AlertCircle size={10} />
                              <span>Retraso:</span>
                              {moment(order.delay_date).fromNow()}
                            </div>
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">Productos:</span>
                      {order.order_items?.length} producto(s)
                    </div>
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
                            <Image src={oI.products.image_min} layout="fill" objectFit="cover" alt="Product Image" />
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
                    <div className="flex flex-row gap-2 items-center justify-center mt-3">
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        onClick={async () => {
                          setOrderProcessing(order.id);
                          await updateOrder.mutateAsync({ id: order.id, status: 'cancelled_by_restaurant' });
                          ordersQuery.refetch();
                          setOrderProcessing(undefined);
                        }}
                      >
                        Rechazar
                      </Button>
                      <Button
                        variant={"success"}
                        size={"sm"}
                        disabled={updateOrder.isPending && orderProcessing === order.id}
                        onClick={async () => {
                          setOrderProcessing(order.id);
                          await updateOrder.mutateAsync({ id: order.id, status: 'preparing' });
                          ordersQuery.refetch();
                          setOrderProcessing(undefined);
                        }}
                      >
                        {updateOrder.isPending && orderProcessing === order.id && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Aceptar
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    );
  };

  return content();
}

export default PendingOrders
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrders } from "../_hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

const ReadyToDeliver = () => {
  const { ordersQuery } = useOrders();

  return (
    <div className="flex flex-col gap-2 pr-10">
      <Accordion type="multiple" className="w-full">
        {ordersQuery.data
        ?.filter(order => order.status === 'ready_for_pickup')
        ?.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .map((order) => (
          <AccordionItem key={String(order.id)} value={String(order.id!)} className="mb-3">
            <AccordionTrigger className="bg-gray-100/40 px-2 rounded-t-md">
              <div className="flex w-full justify-between gap-1 pr-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Id: </span>
                  <span className="font-bold text-lg">{order.id}</span>
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
                    disabled
                    // disabled={updateOrder.isPending && orderProcessing === order.id}
                    // onClick={async () => {
                    //   setOrderProcessing(order.id)
                    //   await updateOrder.mutateAsync({
                    //     id: order.id,
                    //     status: 'ready_for_pickup'
                    //   })
                    //   ordersQuery.refetch()
                    //   setOrderProcessing(undefined)
                    // }}
                  >
                    {/* {updateOrder.isPending && orderProcessing === order.id && <Loader2 className="w-5 h-5 mr-2 animate-spin" />} */}
                    Marcar como entregada
                  </Button>
                </div>
              </>
            </AccordionContent>
          </AccordionItem>  
        ))}
      </Accordion>
    </div>
  );
}

export default ReadyToDeliver;
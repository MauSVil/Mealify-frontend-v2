import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrders } from "../_hooks/useOrders";
import { Button } from "@/components/ui/button";

const ReadyToDeliver = () => {
  const { ordersQuery } = useOrders();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordersQuery.data?.filter(order => order.status === 'ready_for_pickup').map((or) => (
          <TableRow key={or.id}>
            <TableCell>
              {or.id}
            </TableCell>
            <TableCell>{or.order_items?.length}</TableCell>
            <TableCell>
              <Button>Entregar</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ReadyToDeliver;
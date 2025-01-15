'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProfile } from "../_hooks/useProfile";
import numeral from "numeral";
import moment from "moment";

const Transfers = () => {
  const { transfersQuery } = useProfile();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Creación </TableHead>
          <TableHead>Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transfersQuery.data?.map((tr) => (
          <TableRow key={tr.id}>
            <TableCell>
              {moment.unix(tr.created).format('DD/MM/YYYY')}
            </TableCell>
            <TableCell>
              {numeral(tr.amount / 100).format('$0,0.00')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};

export default Transfers;
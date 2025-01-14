'use client';

import { Loader2, RefreshCwIcon } from "lucide-react";
import { useDashboard } from "./_hooks/useDashboard";
import numeral from "numeral";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  const { totalQuery, ordersQuery } = useDashboard();

  return (
    <>
      <Button
        size={"icon"}
        variant={"outline"}
        className="self-end"
        onClick={() => {
          totalQuery.refetch();
          ordersQuery.refetch();
        }}
      >
        <RefreshCwIcon />
      </Button>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              Total de ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalQuery.isLoading || totalQuery.isRefetching ? <Loader2 className="animate-spin" /> : numeral(totalQuery.data).format("$0,0.00")}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Total de ordenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading || ordersQuery.isRefetching ? <Loader2 className="animate-spin" /> : `${ordersQuery.data?.length} orden(es)`}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Total de ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalQuery.isLoading || totalQuery.isRefetching ? <Loader2 className="animate-spin" /> : numeral(totalQuery.data).format("$0,0.00")}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2 w-full">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              Productos más vendidos
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              Ordenes recientes
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}

export default DashboardPage;


'use client';

import { Loader2, RefreshCwIcon } from "lucide-react";
import { useDashboard } from "./_hooks/useDashboard";
import numeral from "numeral";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis } from "recharts";

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const chartConfig = {
  order: {
    label: "Ordenes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const chartConfig1 = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const DashboardPage = () => {
  const {
    totalQuery,
    ordersQuery,
    productsQuery,
    refresh
  } = useDashboard();

  const initMonths = {
    'Enero': 0,
    'Febrero': 0,
    'Marzo': 0,
    'Abril': 0,
    'Mayo': 0,
    'Junio': 0,
  }

  const ordersPerMonth = ordersQuery.data?.reduce((acc: { [key: string]: number }, order) => {
    const month = capitalizeFirstLetter(order.created_at ? new Date(order.created_at).toLocaleString('default', { month: 'long' }) : 'Unknown');
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += 1;
    return acc;
  }, initMonths) || {};

  const chartData = Object.keys(ordersPerMonth).map((month) => ({
    month,
    order: ordersPerMonth[month],
  }));

  const products: { [key: string]: number } = ordersQuery.data?.reduce((acc: { [key: string]: number }, order) => {
    order.order_items!.forEach((item) => {
      if (!acc[item.id]) {
        acc[item.id] = 0;
      }
      acc[item.id] += item.quantity;
    });
    return acc;
  }, {}) || {};

  const chartData1 = Object.keys(products).map((id) => ({
    month: id,
    desktop: products[id],
  }));

  return (
    <>
      <Button
        size={"icon"}
        variant={"outline"}
        className="self-end"
        onClick={refresh}
      >
        <RefreshCwIcon />
      </Button>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de ventas</CardTitle>
            <CardDescription>
              Total de ventas en el mes - {new Date().toLocaleString('default', { month: 'long' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {totalQuery.isLoading || totalQuery.isRefetching ? <Loader2 className="animate-spin" /> : (
              <p className="text-2xl font-bold">
                {numeral(totalQuery.data).format("$0,0.00")}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de ordenes</CardTitle>
            <CardDescription>
              Total de ordenes en el mes - {new Date().toLocaleString('default', { month: 'long' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading || ordersQuery.isRefetching ? <Loader2 className="animate-spin" /> : (
              <p className="text-2xl font-bold">
                {`${ordersQuery.data?.length} orden(es)`}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de productos</CardTitle>
            <CardDescription>
              Productos en el inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsQuery.isLoading || productsQuery.isRefetching ? <Loader2 className="animate-spin" /> : (
              <p className="text-2xl font-bold">
                {`${productsQuery.data?.length} producto(s)`}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2 w-full">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Productos más vendidos</CardTitle>
            <CardDescription>
              Productos más vendidos en el año actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig1}>
              <BarChart accessibilityLayer data={chartData1}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Ordenes por mes</CardTitle>
            <CardDescription>
              Ordenes por mes en el año actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="order"
                  stroke="var(--color-order)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-order)",
                  }}
                  activeDot={{
                    r: 4,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default DashboardPage;


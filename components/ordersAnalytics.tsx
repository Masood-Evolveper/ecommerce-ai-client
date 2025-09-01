"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Percent } from "lucide-react";
import { DarazOrderInfo } from "@/interfaces/daraz.interface";

// ==== Utilities ====
const PKR = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(
    isFinite(n) ? n : 0
  );

const safeNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const parsed = parseFloat(v.replace(/[^\d.-]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const formatDateKey = (input: string): string => {
  // normalize "YYYY-MM-DD" using local date
  const d = new Date(input.replace("+0800", "+08:00"));
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
};

// ==== Component ====
export default function OrdersAnalytics({ orders }: { orders: DarazOrderInfo[] }) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // ===== Derived metrics =====
  const {
    totalRevenue,
    totalOrders,
    aov,
    codPercent,
    overTime,
    topProducts,
    byCity,
    paymentBreakdown,
    shipmentProviders,
    shippingFeeTrend,
  } = useMemo(() => {
    const totalOrders = orders.length;

    // Revenue from items (more reliable than order.price)
    let totalRevenue = 0;
    const paymentCounts: Record<string, number> = {};
    const overTimeMap: Record<string, { date: string; orders: number; revenue: number }> = {};
    const productMap: Record<string, { name: string; revenue: number; qty: number }> = {};
    const cityMap: Record<string, { city: string; orders: number }> = {};
    const providerMap: Record<string, { name: string; value: number }> = {};
    const shippingTrendMap: Record<string, { date: string; fee: number }> = {};

    for (const o of orders) {
      // Payment method breakdown
      const pm = (o.payment_method || "Online").toUpperCase();
      paymentCounts[pm] = (paymentCounts[pm] ?? 0) + 1;

      // Date group key
      const dateKey = formatDateKey(o.created_at);
      if (!overTimeMap[dateKey]) overTimeMap[dateKey] = { date: dateKey, orders: 0, revenue: 0 };
      overTimeMap[dateKey].orders += 1;

      // City grouping
      const city = (o.address_shipping?.city || "Unknown").trim();
      cityMap[city] = { city, orders: (cityMap[city]?.orders ?? 0) + 1 };

      // Shipping fee trend
      shippingTrendMap[dateKey] = {
        date: dateKey,
        fee: (shippingTrendMap[dateKey]?.fee ?? 0) + safeNum(o.shipping_fee),
      };

      // Items
      for (const it of o.items || []) {
        const paid = safeNum(it.paid_price);
        totalRevenue += paid;
        overTimeMap[dateKey].revenue += paid;

        const key = it.name || it.sku || String(it.order_item_id);
        if (!productMap[key]) productMap[key] = { name: key, revenue: 0, qty: 0 };
        productMap[key].revenue += paid;
        productMap[key].qty += 1;

        // shipment providers
        const prov = (it.shipment_provider || "Others").trim();
        providerMap[prov] = { name: prov, value: (providerMap[prov]?.value ?? 0) + 1 };
      }
    }

    const aov = totalOrders ? totalRevenue / totalOrders : 0;

    const codCount = (paymentCounts["COD"] ?? 0);
    const codPercent = totalOrders ? (codCount / totalOrders) * 100 : 0;

    const overTime = Object.values(overTimeMap)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const byCity = Object.values(cityMap)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 12);

    const paymentBreakdown = Object.entries(paymentCounts).map(([name, value]) => ({
      name,
      value,
    }));

    const shipmentProviders = Object.values(providerMap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const shippingFeeTrend = Object.values(shippingTrendMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      totalRevenue,
      totalOrders,
      aov,
      codPercent,
      overTime,
      topProducts,
      byCity,
      paymentBreakdown,
      shipmentProviders,
      shippingFeeTrend,
    };
  }, [orders]);

  const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#84cc16", "#e11d48"];

  return (
    <section className="mt-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PKR(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Sum of paid item prices</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders in selected range</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PKR(aov)}</div>
            <p className="text-xs text-muted-foreground mt-1">Revenue / Orders</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">COD Share</CardTitle>
            <Percent className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{codPercent.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">COD as % of orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="geo">Geography</TabsTrigger>
        </TabsList>

        {/* === Overview === */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Payout / Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={overTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(v: number, n) => [n === "revenue" ? PKR(v) : v, n === "revenue" ? "Revenue" : "Orders"]}
                    />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" fill="#a5b4fc" />
                    <Area type="monotone" dataKey="orders" name="Orders" stroke="#22c55e" fill="#bbf7d0" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      paddingAngle={2}
                    >
                      {paymentBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === Sales === */}
        <TabsContent value="sales" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Top Products (by Revenue)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickFormatter={(v: string) => (v.length > 12 ? v.slice(0, 12) + "…" : v)}
                      interval={0}
                      height={60}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip formatter={(v: number) => PKR(v)} />
                    <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Average Shipping Fee Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={shippingFeeTrend.map((d) => ({
                      date: d.date,
                      avgFee: d.fee / Math.max(1, orders.filter((o) => formatDateKey(o.created_at) === d.date).length),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(v: number) => PKR(v)} />
                    <Area type="monotone" dataKey="avgFee" name="Avg Shipping Fee" stroke="#22c55e" fill="#bbf7d0" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === Logistics === */}
        <TabsContent value="logistics" className="mt-6 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Shipment Providers Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={shipmentProviders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" name="Orders" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Geography === */}
        <TabsContent value="geo" className="mt-6 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Orders by City</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={byCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" interval={0} height={60} angle={-10} textAnchor="end" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" name="Orders" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

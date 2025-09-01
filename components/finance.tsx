"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { DollarSign, TrendingUp, CreditCard, Filter } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ParsedDarazPayoutStatement } from "../interfaces/daraz.interface";
import PayoutTrendChart from "./trend-chart";
import PieChartComponent from "./pie-chart";

export default function PayoutDashboard({
  statements,
}: {
  statements: ParsedDarazPayoutStatement[];
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [hoveredStatement, setHoveredStatement] = useState<string | null>(null);

  // Calculate overview metrics
  // const totalPayouts = useMemo(
  //   () =>
  //     statements.filter((s) => s.paid).reduce((sum, s) => sum + s.payout, 0),
  //   []
  // );
  const totalPayouts = useMemo(
    () =>
      statements
        .filter((s) => Boolean(Number(s.paid)))
        .reduce(
          (sum, s) =>
            sum + parseFloat(String(s.payout).replace("PKR", "").trim()),
          0
        ),
    [statements]
  );
  console.log("Total Payouts:", totalPayouts);

  const currentBalance = useMemo(
    () => statements[statements.length - 1]?.closing_balance || 0,
    []
  );

  const unpaidBalance = useMemo(
    () =>
      statements.filter((s) => !s.paid).reduce((sum, s) => sum + s.payout, 0),
    []
  );

  // Filter statements
  const filteredStatements = useMemo(() => {
    if (filterStatus === "all") return statements;
    return statements.filter((s) =>
      filterStatus === "paid" ? s.paid : !s.paid
    );
  }, [filterStatus]);

  const payoutTrendData = statements.map((s) => ({
    date: new Date(s.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    payout: parseFloat(s.payout.toString().replace(/[^\d.-]/g, "")) || 0,
    fees: parseFloat(s.fees_total.toString().replace(/[^\d.-]/g, "")) || 0,
  }));

  const revenueBreakdownData = [
    // {
    //   name: "Item Revenue",
    //   value: statements.reduce((sum, s) => sum + s.item_revenue, 0),
    //   color: "hsl(var(--chart-1))",
    // },
    // {
    //   name: "Fees",
    //   value: statements.reduce((sum, s) => sum + s.fees_total, 0),
    //   color: "hsl(var(--chart-2))",
    // },
    // {
    //   name: "Other Revenue",
    //   value: statements.reduce((sum, s) => sum + s.other_revenue_total, 0),
    //   color: "hsl(var(--chart-3))",
    // },
    {
      name: "Item Revenue",
      value: statements.reduce((sum, s) => sum + Number(s.item_revenue), 0),
      color: "#8884d8",
    },
    {
      name: "Fees",
      value: statements.reduce((sum, s) => sum + Number(s.fees_total), 0),
      color: "#82ca9d",
    },
    { name: "Other Revenue", value: statements.reduce((sum, s) => sum + Number(s.other_revenue_total), 0), color: "#ff7f50" },
    // { name: "Product C", value: 300, color: "#ffc658" },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatCurrencyPKR = (amount: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <header className="bg-primary text-primary-foreground px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Seller Payout Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">
              Last updated: {formatDate(new Date().toISOString())}
            </span>
          </div>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Payouts
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrencyPKR(totalPayouts)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From paid statements
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrencyPKR(currentBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Latest closing balance
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unpaid Balance
              </CardTitle>
              <CreditCard className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {formatCurrencyPKR(unpaidBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Pending payouts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payout Trends Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Payout Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <ResponsiveContainer width="100%" height={300}>
                <LineChart data={payoutTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="payout"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer> */}
              <PayoutTrendChart data={payoutTrendData} />
            </CardContent>
          </Card>

          {/* Revenue Breakdown Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrencyPKR(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer> */}
              <PieChartComponent pieProps={revenueBreakdownData} />
            </CardContent>
          </Card>
        </div>

        {/* Statements Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold">
                Statement History
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Statement #
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                      Payout
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                      Balance
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                      Fees
                    </th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStatements.map((statement) => (
                    <tr
                      key={statement.statement_number}
                      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredStatement(statement.statement_number)
                      }
                      onMouseLeave={() => setHoveredStatement(null)}
                    >
                      <td className="py-4 px-2 font-mono text-sm">
                        {statement.statement_number}
                      </td>
                      <td className="py-4 px-2 text-sm">
                        {formatDate(statement.created_at.toString())}
                      </td>
                      <td className="py-4 px-2 text-right font-semibold">
                        {formatCurrencyPKR(
                          parseFloat(
                            String(statement.payout).replace("PKR", "").trim()
                          )
                        )}
                      </td>
                      <td className="py-4 px-2 text-right font-medium">
                        {formatCurrencyPKR(statement.closing_balance)}
                      </td>
                      <td className="py-4 px-2 text-right text-destructive font-medium">
                        {formatCurrencyPKR(statement.fees_total)}
                      </td>
                      <td className="py-4 px-2 text-center">
                        <Badge
                          variant={statement.paid ? "default" : "destructive"}
                        >
                          {statement.paid ? "Paid" : "Unpaid"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tooltip for hovered statement */}
            {hoveredStatement && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                {(() => {
                  const statement = statements.find(
                    (s) => s.statement_number === hoveredStatement
                  );
                  if (!statement) return null;
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Opening Balance:
                        </span>
                        <div className="font-medium">
                          {formatCurrencyPKR(statement.opening_balance)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Item Revenue:
                        </span>
                        <div className="font-medium">
                          {formatCurrencyPKR(
                            parseFloat(
                              String(statement.item_revenue)
                                .replace("PKR", "")
                                .trim()
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Refunds:</span>
                        <div className="font-medium text-destructive">
                          {formatCurrencyPKR(statement.refunds)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Other Revenue:
                        </span>
                        <div className="font-medium">
                          {formatCurrencyPKR(statement.other_revenue_total)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

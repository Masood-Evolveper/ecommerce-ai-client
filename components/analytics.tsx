import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import PayoutDashboard from "./finance";
import { DarazOrderInfo, ParsedDarazPayoutStatement } from "@/interfaces/daraz.interface";
import OrdersAnalytics from "./ordersAnalytics";

const analyticsTabs = [
  "Orders",
  "Products",
  "Returns",
  "Finance",
  "Inventory",
]

export default function AnalyticsSection({ payoutData, orders }: { payoutData: ParsedDarazPayoutStatement[], orders: DarazOrderInfo[] }) {
  return (
    <div className="mt-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-2">
          Switch between different views of your analytics.
        </p>
      </div>

      <Tabs defaultValue="finance" className="w-full">
        {/* Tabs Header */}
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="sales">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        {/* Finance Analytics */}
        <TabsContent value="finance" className="mt-6">
          <PayoutDashboard statements={payoutData} />
        </TabsContent>

        {/* Sales Analytics */}
        <TabsContent value="sales" className="mt-6">
          <div className="p-6 rounded-2xl border bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">Sales Overview</h2>
            <p className="text-sm text-muted-foreground">
              Sales charts, top-performing products, and revenue breakdown will go here.
            </p>
            <OrdersAnalytics orders={orders}/>
          </div>
        </TabsContent>

        {/* Inventory Analytics */}
        <TabsContent value="inventory" className="mt-6">
          <div className="p-6 rounded-2xl border bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">Inventory Status</h2>
            <p className="text-sm text-muted-foreground">
              Stock levels, low-stock alerts, and warehouse analytics will go here.
            </p>
          </div>
        </TabsContent>

        {/* Returns Analytics */}
        <TabsContent value="returns" className="mt-6">
          <div className="p-6 rounded-2xl border bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">Returns Overview</h2>
            <p className="text-sm text-muted-foreground">
              Return trends, reasons, and refund analysis will go here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

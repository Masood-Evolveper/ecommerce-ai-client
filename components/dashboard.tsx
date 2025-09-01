"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Store,
  Plus,
  Settings,
  LogOut,
  Package,
  TrendingUp,
  ShoppingCart,
  Truck,
  AlertTriangle,
  DollarSign,
  Percent,
  Star,
} from "lucide-react";
import SideBar from "@/components/sidebar";
import { DarazOrderInfo, ParsedDarazPayoutStatement } from "@/interfaces/daraz.interface";
import PayoutDashboard from "./finance";
import AnalyticsSection from "./analytics";

export default function Dashboard({payoutData, orders}: {payoutData: ParsedDarazPayoutStatement[], orders: DarazOrderInfo[]}) {
  // const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   const isAuthenticated = localStorage.getItem("isAuthenticated");
  //   const email = localStorage.getItem("userEmail");

  //   if (!isAuthenticated) {
  //     router.push("/");
  //     return;
  //   }

  //   setUserEmail(email || "");
  //   setIsLoading(false);
  // }, [router]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Welcome back! Here's an overview of your e-commerce operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No products listed yet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Connected Platforms
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Connect your first platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Your sales of the current month
              </p>
            </CardContent>
          </Card>
        </div>

        <AnalyticsSection payoutData={payoutData} orders={orders}/>
        {/* <AnalyticsSection payoutData={payoutData}/> */}
      </div>
    </div>
  );
}

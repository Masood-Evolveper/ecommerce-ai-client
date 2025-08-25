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
} from "lucide-react";

export default function SideBar() {
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");

    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    setUserEmail(email || "");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#151a37] text-white p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">E-Commerce Manager</h1>
        <p className="text-sm text-slate-300 mt-1">{userEmail}</p>
      </div>

      <nav className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
        >
          <TrendingUp className="mr-3 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={() => router.push("/platforms")}
        >
          <Store className="mr-3 h-4 w-4" />
          Platform Integration
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={() => router.push("/products")}
        >
          <Package className="mr-3 h-4 w-4" />
          Product Listing
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={() => router.push("/inventory")}
        >
          <ShoppingBag className="mr-3 h-4 w-4" />
          All Products
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={() => router.push("/orders")}
        >
          <ShoppingCart className="mr-3 h-4 w-4" />
          Orders
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={() => router.push("/logistics")}
        >
          <Truck className="mr-3 h-4 w-4" />
          Logistics
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

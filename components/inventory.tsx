"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Edit, Trash2 } from "lucide-react";
import SideBar from "./sidebar";
import { UnifiedProduct } from "@/interfaces/product.interface";
import Image from "next/image";
import { getPlatformIcon } from "@/lib/utils";

export default function ProductList({ products }: { products: UnifiedProduct[] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<UnifiedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    setFilteredProducts(products);
    setIsLoading(false);
  }, [products, router]);

  useEffect(() => {
    let temp = [...products];

    // Search filter
    if (searchTerm) {
      temp = temp.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Platform filter
    if (platformFilter !== "all") {
      temp = temp.filter((p) => p.platform === platformFilter);
    }

    // Inventory filter
    if (inventoryFilter === "low") {
      temp = temp.filter((p) => p.inventory > 0 && p.inventory <= 5);
    } else if (inventoryFilter === "out") {
      temp = temp.filter((p) => p.inventory === 0);
    }

    // Status filter
    if (statusFilter !== "all") {
      temp = temp.filter((p) => p.status.toLowerCase() === statusFilter);
    }

    setFilteredProducts(temp);
  }, [searchTerm, platformFilter, inventoryFilter, statusFilter, products]);

  const getInventoryStatus = (inventory: number) => {
    if (inventory === 0)
      return { text: "Out of Stock", variant: "destructive" as const };
    if (inventory <= 5)
      return { text: "Low Stock", variant: "secondary" as const };
    return { text: "In Stock", variant: "default" as const };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Product Inventory</h1>
          <p className="text-slate-600 mt-2">
            Manage your product listings and inventory across all platforms.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="shopify">Shopify</SelectItem>
                  <SelectItem value="daraz">Daraz</SelectItem>
                </SelectContent>
              </Select>

              <Select value={inventoryFilter} onValueChange={setInventoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Inventory Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Inventory</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Product Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Unified Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>{renderUnifiedTable()}</CardContent>
        </Card>
      </div>
    </div>
  );

  function renderUnifiedTable() {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Inventory</th>
              <th className="p-4 text-left">Variants</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Platform</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const inventoryStatus = getInventoryStatus(p.inventory);
              return (
                <tr key={`${p.platform}-${p.id}`} className="border-b hover:bg-slate-50">
                  <td className="p-4">
                    <img
                      src={p.images[0] || "/placeholder.svg"}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">
                    <Badge variant={inventoryStatus.variant}>
                      {inventoryStatus.text}
                    </Badge>
                  </td>
                  <td className="p-4">{p.variants} variant(s)</td>
                  <td className="p-4">
                    <Badge
                      variant={p.status.toLowerCase() === "active" ? "default" : "secondary"}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                                             <Image src={getPlatformIcon(p.platform)} alt="Platform Logo" width={50} height={50} />
                                           </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingBag,
  Store,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { DarazProduct } from "@/interfaces/daraz.interface";
import Link from "next/link";
import SideBar from "./sidebar";

export default function ProductList({
  darazAllProducts,
}: {
  darazAllProducts: DarazProduct[];
}) {
  console.log("Daraz All Products:", darazAllProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<DarazProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DarazProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    setProducts(darazAllProducts);
    setFilteredProducts(darazAllProducts);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.seoTags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((product) => {
        switch (platformFilter) {
          case "shopify":
            return product.platforms.shopify;
          case "daraz":
            return product.platforms.daraz;
          case "amazon":
            return product.platforms.amazon;
          default:
            return true;
        }
      });
    }

    // Inventory filter
    if (inventoryFilter !== "all") {
      filtered = filtered.filter((product) => {
        switch (inventoryFilter) {
          case "low":
            return product.inventory > 0 && product.inventory <= 5;
          case "out":
            return product.inventory === 0;
          default:
            return true;
        }
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => {
        switch (statusFilter) {
          case "active":
            return product.isActive;
          case "inactive":
            return !product.isActive;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, platformFilter, inventoryFilter, statusFilter]);



  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === "activate") {
      setProducts((prev) =>
        prev.map((p) =>
          selectedProducts.includes(p.id) ? { ...p, isActive: true } : p
        )
      );
    } else if (action === "deactivate") {
      setProducts((prev) =>
        prev.map((p) =>
          selectedProducts.includes(p.id) ? { ...p, isActive: false } : p
        )
      );
    } else if (action === "delete") {
      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p.id))
      );
    }
    setSelectedProducts([]);
  };

  const getInventoryStatus = (inventory: number) => {
    if (inventory === 0)
      return { text: "Out of Stock", variant: "destructive" as const };
    if (inventory <= 5)
      return { text: "Low Stock", variant: "secondary" as const };
    return { text: "In Stock", variant: "default" as const };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SideBar/>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Product Inventory
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your product listings and inventory across all platforms.
          </p>
        </div>

        {/* Filters and Search */}
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
                  placeholder="Search by name, SKU, or tags..."
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
                  <SelectItem value="amazon">Amazon</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={inventoryFilter}
                onValueChange={setInventoryFilter}
              >
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

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedProducts.length} product(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("activate")}
                  >
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("deactivate")}
                  >
                    Deactivate
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("delete")}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">
                      <Checkbox
                        checked={
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4">Image</th>
                    <th className="text-left p-4">Product Name</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">SKU</th>
                    <th className="text-left p-4">Inventory</th>
                    <th className="text-left p-4">Size</th>
                    <th className="text-left p-4">Variants</th>
                    <th className="text-left p-4">Platforms</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const inventoryStatus = getInventoryStatus(
                      product.inventory
                    );
                    return (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-slate-50"
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() =>
                              handleSelectProduct(product.id)
                            }
                          />
                        </td>
                        <td className="p-4">
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">
                              <Link
                                href={product.url}
                                target="_blank"
                                className="text-blue-600 hover:underline"
                              >
                                {product.name}
                              </Link>
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4 font-mono text-sm">{product.sku}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                product.inventory <= 5
                                  ? "text-red-600 font-medium"
                                  : ""
                              }
                            >
                              {product.inventory}
                            </span>
                            {product.inventory <= 5 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <Badge
                            variant={inventoryStatus.variant}
                            className="text-xs mt-1"
                          >
                            {inventoryStatus.text}
                          </Badge>
                        </td>
                        <td className="p-4">{product.size}</td>
                        <td className="p-4">
                          <div className="text-sm">
                            {product.variants.length} variant(s)
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {product.platforms.shopify && (
                              <Badge variant="outline" className="text-xs">
                                Shopify
                              </Badge>
                            )}
                            {product.platforms.daraz && (
                              <Badge variant="outline" className="text-xs">
                                Daraz
                              </Badge>
                            )}
                            {product.platforms.amazon && (
                              <Badge variant="outline" className="text-xs">
                                Amazon
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No products found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

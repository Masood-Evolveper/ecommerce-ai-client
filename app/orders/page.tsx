"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingBag,
  Store,
  Search,
  Filter,
  Eye,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  ShoppingCart,
  Calendar,
} from "lucide-react"

interface Order {
  id: string
  platform: "shopify" | "daraz" | "amazon"
  customerName: string
  customerEmail: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  date: string
  items: {
    productName: string
    quantity: number
    price: number
  }[]
  shippingAddress: string
  paymentStatus: "paid" | "pending" | "failed"
}

export default function Orders() {
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (!isAuthenticated) {
      router.push("/")
      return
    }

    setUserEmail(email || "")

    // Load sample orders for demonstration
    const sampleOrders: Order[] = [
      {
        id: "ORD-001",
        platform: "shopify",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        status: "pending",
        totalAmount: 299.99,
        date: "2024-01-15",
        items: [{ productName: "Premium Wireless Headphones", quantity: 1, price: 299.99 }],
        shippingAddress: "123 Main St, New York, NY 10001",
        paymentStatus: "paid",
      },
      {
        id: "ORD-002",
        platform: "daraz",
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        status: "shipped",
        totalAmount: 89.99,
        date: "2024-01-14",
        items: [{ productName: "Cotton T-Shirt", quantity: 2, price: 44.99 }],
        shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
        paymentStatus: "paid",
      },
      {
        id: "ORD-003",
        platform: "amazon",
        customerName: "Mike Johnson",
        customerEmail: "mike@example.com",
        status: "delivered",
        totalAmount: 199.99,
        date: "2024-01-13",
        items: [{ productName: "Smart Watch", quantity: 1, price: 199.99 }],
        shippingAddress: "789 Pine St, Chicago, IL 60601",
        paymentStatus: "paid",
      },
      {
        id: "ORD-004",
        platform: "shopify",
        customerName: "Sarah Wilson",
        customerEmail: "sarah@example.com",
        status: "cancelled",
        totalAmount: 149.99,
        date: "2024-01-12",
        items: [{ productName: "Premium Wireless Headphones", quantity: 1, price: 149.99 }],
        shippingAddress: "321 Elm St, Miami, FL 33101",
        paymentStatus: "failed",
      },
    ]

    setOrders(sampleOrders)
    setFilteredOrders(sampleOrders)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((order) => order.platform === platformFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date()
      const orderDate = new Date()

      filtered = filtered.filter((order) => {
        const orderDateTime = new Date(order.date)
        switch (dateFilter) {
          case "today":
            return orderDateTime.toDateString() === today.toDateString()
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            return orderDateTime >= weekAgo
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
            return orderDateTime >= monthAgo
          default:
            return true
        }
      })
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, platformFilter, statusFilter, dateFilter])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "shopify":
        return "🛍️"
      case "daraz":
        return "🛒"
      case "amazon":
        return "📦"
      default:
        return "🏪"
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as Order["status"] } : order)),
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#151a37] text-white p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">E-Commerce Manager</h1>
          <p className="text-sm text-slate-300 mt-1">{userEmail}</p>
        </div>

        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => router.push("/dashboard")}
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
            Product List
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white bg-white/10">
            <ShoppingCart className="mr-3 h-4 w-4" />
            Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-2">Track and manage orders from all your connected platforms.</p>
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
                  placeholder="Search orders, customers..."
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">Platform</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Total Amount</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Payment</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono text-sm">{order.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPlatformIcon(order.platform)}</span>
                          <span className="capitalize">{order.platform}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-32">
                            <Badge variant={getStatusColor(order.status) as any} className="capitalize">
                              {order.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            order.paymentStatus === "paid"
                              ? "default"
                              : order.paymentStatus === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/orders/${order.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No orders found matching your filters.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

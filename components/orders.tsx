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
import { DarazOrder } from "@/interfaces/daraz.interface"
import SideBar from "./sidebar"
import darazLogo from "@/public/daraz.png";
import amazonLogo from "@/public/amazon.png";
import shopifyLogo from "@/public/shopify.png";
import Image from "next/image"



export default function ListOrders({ orders }: { orders: DarazOrder[]} ) {
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
//   const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<DarazOrder[]>([])
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

    // setOrders(orders)
    setFilteredOrders(orders)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address_shipping.phone.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((order) => order.platform === platformFilter)
    }

    // Status filter
    // if (statusFilter !== "all") {
    //   filtered = filtered.filter((order) => order.status === statusFilter)
    // }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date()
      const orderDate = new Date()

      filtered = filtered.filter((order) => {
        const orderDateTime = new Date(order.created_at)
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
        return shopifyLogo
      case "daraz":
        return darazLogo
      case "amazon":
        return amazonLogo
      default:
        return darazLogo
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // setOrders((prev) =>
    //   prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as Order["status"] } : order)),
    // )
    setFilteredOrders((prev) =>
      prev.map((order) => (order.order_id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">Loading...</div>
//       </div>
//     )
//   }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SideBar/>

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
                  {filteredOrders.map((order, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono text-sm">{order.order_id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Image src={getPlatformIcon("daraz")} alt="Platform Logo" width={50} height={50} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{order.customer_first_name +" "+ order.customer_last_name}</div>
                          <div className="text-sm text-muted-foreground">{order.address_shipping.phone}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {/* <Select value={order.statuses[0]} onValueChange={(value) => updateOrderStatus(order.order_id, value)}> */}
                          {/* <SelectTrigger className="w-32"> */}
                            <Badge variant={getStatusColor(order.statuses[0]) as any} className="capitalize">
                                   {order.statuses[0]}
                            </Badge>
                          {/* </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select> */}
                      </td>
                      <td className="p-4 font-medium">PKR {order.price}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          // variant={
                          //   order.paymentStatus === "paid"
                          //     ? "default"
                          //     : order.paymentStatus === "pending"
                          //       ? "secondary"
                          //       : "destructive"
                          // }
                        >
                          {order.payment_method}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/orders/${order.order_id}`)}>
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

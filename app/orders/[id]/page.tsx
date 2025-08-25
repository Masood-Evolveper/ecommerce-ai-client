"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  ShoppingBag,
  Store,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  ShoppingCart,
  ArrowLeft,
  Download,
  Check,
  X,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

interface OrderItem {
  productName: string
  quantity: number
  price: number
}

interface OrderDetails {
  id: string
  platform: "shopify" | "daraz" | "amazon"
  customerName: string
  customerEmail: string
  customerPhone: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  date: string
  items: OrderItem[]
  shippingAddress: string
  paymentStatus: "paid" | "pending" | "failed"
  courierService?: string
  trackingNumber?: string
}

export default function OrderDetails() {
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (!isAuthenticated) {
      router.push("/")
      return
    }

    setUserEmail(email || "")

    // Load sample order details for demonstration
    const sampleOrder: OrderDetails = {
      id: params.id as string,
      platform: "shopify",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1 (555) 123-4567",
      status: "pending",
      totalAmount: 299.99,
      date: "2024-01-15",
      items: [{ productName: "Premium Wireless Headphones", quantity: 1, price: 299.99 }],
      shippingAddress: "123 Main St, Apt 4B, New York, NY 10001, United States",
      paymentStatus: "paid",
      courierService: "FedEx",
      trackingNumber: "1234567890",
    }

    setOrder(sampleOrder)
    setIsLoading(false)
  }, [router, params.id])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const updateOrderStatus = (newStatus: string) => {
    if (order) {
      setOrder({ ...order, status: newStatus as OrderDetails["status"] })
    }
  }

  const handleConfirmOrder = () => {
    updateOrderStatus("confirmed")
  }

  const handleCancelOrder = () => {
    updateOrderStatus("cancelled")
  }

  const handleDownloadLabel = () => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "/placeholder.pdf"
    link.download = `shipping-label-${order?.id}.pdf`
    link.click()
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Order not found</div>
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
          <Button
            variant="ghost"
            className="w-full justify-start text-white bg-white/10"
            onClick={() => router.push("/orders")}
          >
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
          <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Order Details</h1>
          <p className="text-slate-600 mt-2">Order #{order.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Summary</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatformIcon(order.platform)}</span>
                    <span className="capitalize text-sm">{order.platform}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium text-lg">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Select value={order.status} onValueChange={updateOrderStatus}>
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
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">each</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-medium text-lg">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer & Actions */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{order.shippingAddress}</p>
                </div>
                {order.courierService && (
                  <div>
                    <p className="text-sm text-muted-foreground">Courier Service</p>
                    <p className="font-medium">{order.courierService}</p>
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-medium font-mono">{order.trackingNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleConfirmOrder} disabled={order.status !== "pending"}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleCancelOrder}
                  disabled={order.status === "delivered" || order.status === "cancelled"}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleDownloadLabel}
                  disabled={order.status === "pending" || order.status === "cancelled"}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Shipping Label
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

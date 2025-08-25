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
  Package,
  TrendingUp,
  Settings,
  LogOut,
  ShoppingCart,
  Truck,
  MapPin,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

interface CourierShipment {
  orderId: string
  courierService: string
  courierStatus: "accepted" | "in-transit" | "delivered" | "rejected"
  trackingNumber: string
  customerName: string
  destination: string
  estimatedDelivery: string
  lastUpdate: string
  platform: "shopify" | "daraz" | "amazon"
}

interface CourierService {
  name: string
  isConnected: boolean
  activeShipments: number
  logo: string
}

export default function Logistics() {
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [shipments, setShipments] = useState<CourierShipment[]>([])
  const [filteredShipments, setFilteredShipments] = useState<CourierShipment[]>([])
  const [courierServices, setCourierServices] = useState<CourierService[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [courierFilter, setCourierFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (!isAuthenticated) {
      router.push("/")
      return
    }

    setUserEmail(email || "")

    // Load sample courier services
    const sampleCourierServices: CourierService[] = [
      { name: "FedEx", isConnected: true, activeShipments: 5, logo: "🚚" },
      { name: "UPS", isConnected: true, activeShipments: 3, logo: "📦" },
      { name: "DHL", isConnected: false, activeShipments: 0, logo: "✈️" },
      { name: "USPS", isConnected: true, activeShipments: 2, logo: "📮" },
      { name: "Local Courier", isConnected: false, activeShipments: 0, logo: "🏍️" },
    ]

    // Load sample shipments
    const sampleShipments: CourierShipment[] = [
      {
        orderId: "ORD-001",
        courierService: "FedEx",
        courierStatus: "in-transit",
        trackingNumber: "1234567890",
        customerName: "John Doe",
        destination: "New York, NY",
        estimatedDelivery: "2024-01-18",
        lastUpdate: "2024-01-16 10:30 AM",
        platform: "shopify",
      },
      {
        orderId: "ORD-002",
        courierService: "UPS",
        courierStatus: "accepted",
        trackingNumber: "UPS123456789",
        customerName: "Jane Smith",
        destination: "Los Angeles, CA",
        estimatedDelivery: "2024-01-19",
        lastUpdate: "2024-01-16 09:15 AM",
        platform: "daraz",
      },
      {
        orderId: "ORD-003",
        courierService: "FedEx",
        courierStatus: "delivered",
        trackingNumber: "FDX987654321",
        customerName: "Mike Johnson",
        destination: "Chicago, IL",
        estimatedDelivery: "2024-01-15",
        lastUpdate: "2024-01-15 02:45 PM",
        platform: "amazon",
      },
      {
        orderId: "ORD-004",
        courierService: "USPS",
        courierStatus: "rejected",
        trackingNumber: "USPS456789123",
        customerName: "Sarah Wilson",
        destination: "Miami, FL",
        estimatedDelivery: "N/A",
        lastUpdate: "2024-01-16 08:00 AM",
        platform: "shopify",
      },
      {
        orderId: "ORD-005",
        courierService: "UPS",
        courierStatus: "in-transit",
        trackingNumber: "UPS789123456",
        customerName: "David Brown",
        destination: "Seattle, WA",
        estimatedDelivery: "2024-01-17",
        lastUpdate: "2024-01-16 11:20 AM",
        platform: "daraz",
      },
    ]

    setCourierServices(sampleCourierServices)
    setShipments(sampleShipments)
    setFilteredShipments(sampleShipments)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    let filtered = shipments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Courier filter
    if (courierFilter !== "all") {
      filtered = filtered.filter((shipment) => shipment.courierService === courierFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((shipment) => shipment.courierStatus === statusFilter)
    }

    setFilteredShipments(filtered)
  }, [shipments, searchTerm, courierFilter, statusFilter])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "secondary"
      case "in-transit":
        return "default"
      case "delivered":
        return "default"
      case "rejected":
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

  const handleTrackShipment = (trackingNumber: string, courierService: string) => {
    // Simulate opening tracking page
    window.open(`https://example.com/track/${trackingNumber}`, "_blank")
  }

  const handleReassignCourier = (orderId: string) => {
    // Simulate reassigning courier
    alert(`Reassigning courier for order ${orderId}`)
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
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => router.push("/orders")}
          >
            <ShoppingCart className="mr-3 h-4 w-4" />
            Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white bg-white/10">
            <Truck className="mr-3 h-4 w-4" />
            Logistics
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
          <h1 className="text-3xl font-bold text-slate-900">Logistics Management</h1>
          <p className="text-slate-600 mt-2">Track shipments and manage courier services across all platforms.</p>
        </div>

        {/* Courier Services Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {courierServices.map((service) => (
            <Card key={service.name}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{service.logo}</span>
                    <span className="font-medium text-sm">{service.name}</span>
                  </div>
                  <Badge variant={service.isConnected ? "default" : "secondary"}>
                    {service.isConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {service.activeShipments} active shipment{service.activeShipments !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, tracking numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={courierFilter} onValueChange={setCourierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Courier Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Couriers</SelectItem>
                  {courierServices
                    .filter((service) => service.isConnected)
                    .map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        {service.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">Platform</th>
                    <th className="text-left p-4">Courier Service</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Tracking Number</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Destination</th>
                    <th className="text-left p-4">Est. Delivery</th>
                    <th className="text-left p-4">Last Update</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={`${shipment.orderId}-${shipment.trackingNumber}`} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono text-sm">{shipment.orderId}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPlatformIcon(shipment.platform)}</span>
                          <span className="capitalize text-sm">{shipment.platform}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {courierServices.find((s) => s.name === shipment.courierService)?.logo}
                          </span>
                          <span>{shipment.courierService}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusColor(shipment.courierStatus) as any} className="capitalize">
                          {shipment.courierStatus.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-sm">{shipment.trackingNumber}</td>
                      <td className="p-4">{shipment.customerName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{shipment.destination}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {shipment.estimatedDelivery !== "N/A"
                          ? new Date(shipment.estimatedDelivery).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{shipment.lastUpdate}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTrackShipment(shipment.trackingNumber, shipment.courierService)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Track
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReassignCourier(shipment.orderId)}
                            disabled={shipment.courierStatus === "delivered"}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reassign
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredShipments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No shipments found matching your filters.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

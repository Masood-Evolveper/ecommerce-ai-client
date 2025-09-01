"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  ShoppingBag,
  Store,
  Settings,
  LogOut,
  Package,
  TrendingUp,
  ShoppingCart,
  Truck,
  AlertTriangle,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle,
  XCircle,
  Info,
  Clock,
} from "lucide-react"

// Mock dispute detail data
const mockDisputeDetail = {
  id: "DSP-001",
  orderId: "ORD-12345",
  platform: "Shopify",
  customerInfo: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
  },
  orderDetails: {
    amount: "$89.99",
    date: "2024-01-10",
    items: [{ name: "Wireless Headphones", quantity: 1, price: "$89.99" }],
  },
  dispute: {
    reason: "Damaged item received",
    description:
      "The wireless headphones arrived with a cracked casing and the left speaker is not working properly. I have attached photos showing the damage.",
    status: "Open",
    dateOpened: "2024-01-15",
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
  },
  statusHistory: [
    { status: "Open", date: "2024-01-15", note: "Dispute opened by customer" },
    { status: "In Review", date: "2024-01-16", note: "Case assigned to support team" },
  ],
  notes: [
    { date: "2024-01-15", author: "System", message: "Dispute created automatically from customer return request" },
    { date: "2024-01-16", author: "Support Team", message: "Reviewing customer photos and order details" },
  ],
}

export default function DisputeDetailPage() {
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dispute, setDispute] = useState(mockDisputeDetail)
  const [newNote, setNewNote] = useState("")
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (!isAuthenticated) {
      router.push("/")
      return
    }

    setUserEmail(email || "")
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleStatusUpdate = (newStatus: string) => {
    setDispute((prev) => ({
      ...prev,
      dispute: { ...prev.dispute, status: newStatus },
      statusHistory: [
        ...prev.statusHistory,
        { status: newStatus, date: new Date().toISOString().split("T")[0], note: `Status updated to ${newStatus}` },
      ],
    }))

    toast({
      title: "Status Updated",
      description: `Dispute status has been updated to ${newStatus}.`,
    })
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    setDispute((prev) => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          date: new Date().toISOString().split("T")[0],
          author: "Support Team",
          message: newNote,
        },
      ],
    }))

    setNewNote("")
    toast({
      title: "Note Added",
      description: "Internal note has been added to the dispute.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge variant="destructive">{status}</Badge>
      case "In Review":
        return <Badge variant="secondary">{status}</Badge>
      case "Resolved":
        return (
          <Badge variant="default" className="bg-green-500">
            {status}
          </Badge>
        )
      case "Rejected":
        return <Badge variant="outline">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
            className="w-full justify-start text-white hover:bg-white/10 bg-white/10"
            onClick={() => router.push("/disputes")}
          >
            <AlertTriangle className="mr-3 h-4 w-4" />
            Disputes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => router.push("/settings")}
          >
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
          <Button variant="ghost" onClick={() => router.push("/disputes")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Disputes
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dispute Details</h1>
              <p className="text-slate-600 mt-2">
                Dispute ID: {dispute.id} • Order ID: {dispute.orderId}
              </p>
            </div>
            {getStatusBadge(dispute.dispute.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{dispute.customerInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{dispute.customerInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{dispute.customerInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{dispute.customerInfo.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Dispute Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Reason for Return</h4>
                  <p className="text-sm text-gray-600">{dispute.dispute.reason}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Customer Description</h4>
                  <p className="text-sm text-gray-600">{dispute.dispute.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Uploaded Images</h4>
                  <div className="flex gap-4">
                    {dispute.dispute.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Dispute evidence ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Order Date: {dispute.orderDetails.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Amount: {dispute.orderDetails.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-gray-500" />
                    <span>Platform: {dispute.platform}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  {dispute.orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions and History */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate("Resolved")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Refund
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleStatusUpdate("Rejected")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Request
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleStatusUpdate("In Review")}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Request More Info
                </Button>
              </CardContent>
            </Card>

            {/* Status History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dispute.statusHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(entry.status)}
                          <span className="text-sm text-gray-500">{entry.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Internal Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {dispute.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{note.author}</span>
                        <span className="text-xs text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{note.message}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add internal note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddNote} className="w-full">
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

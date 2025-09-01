"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  ExternalLink,
} from "lucide-react"
import SideBar from "@/components/sidebar"
import { DarazReverseOrder } from "@/interfaces/daraz.interface"

// Mock data for disputes
const mockDisputes = [
  {
    id: "DSP-001",
    orderId: "ORD-12345",
    platform: "Shopify",
    customerName: "John Smith",
    reason: "Damaged item received",
    status: "Open",
    dateOpened: "2024-01-15",
    amount: "$89.99",
  },
  {
    id: "DSP-002",
    orderId: "ORD-12346",
    platform: "Daraz",
    customerName: "Sarah Johnson",
    reason: "Wrong product delivered",
    status: "In Review",
    dateOpened: "2024-01-14",
    amount: "$45.50",
  },
  {
    id: "DSP-003",
    orderId: "ORD-12347",
    platform: "Shopify",
    customerName: "Mike Wilson",
    reason: "Product not as described",
    status: "Resolved",
    dateOpened: "2024-01-12",
    amount: "$129.99",
  },
  {
    id: "DSP-004",
    orderId: "ORD-12348",
    platform: "Daraz",
    customerName: "Emma Davis",
    reason: "Defective product",
    status: "Rejected",
    dateOpened: "2024-01-10",
    amount: "$75.25",
  },
]

export default function DisputesPage({reverseOrdersInfo}:{reverseOrdersInfo:DarazReverseOrder[]}) {
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [disputes, setDisputes] = useState(mockDisputes)
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
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
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
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

  const getPlatformIcon = (platform: string) => {
    return <Store className="h-4 w-4" />
  }

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPlatform = platformFilter === "all" || dispute.platform === platformFilter
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter

    return matchesSearch && matchesPlatform && matchesStatus
  })

  const handleStatusUpdate = (disputeId: string, newStatus: string) => {
    setDisputes((prev) =>
      prev.map((dispute) => (dispute.id === disputeId ? { ...dispute, status: newStatus } : dispute)),
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
      <SideBar/>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Disputes & Returns</h1>
          <p className="text-slate-600 mt-2">Manage customer disputes, returns, and refund requests.</p>
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by customer name, order ID, or dispute ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Shopify">Shopify</SelectItem>
                  <SelectItem value="Daraz">Daraz</SelectItem>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Disputes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Disputes List</CardTitle>
            <CardDescription>
              {filteredDisputes.length} dispute{filteredDisputes.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute ID</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Opened</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">{dispute.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(dispute.platform)}
                          {dispute.platform}
                        </div>
                      </TableCell>
                      <TableCell>{dispute.orderId}</TableCell>
                      <TableCell>{dispute.customerName}</TableCell>
                      <TableCell className="max-w-48 truncate">{dispute.reason}</TableCell>
                      <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                      <TableCell>{dispute.dateOpened}</TableCell>
                      <TableCell>{dispute.amount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/disputes/${dispute.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(dispute.id, "In Review")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Escalate to Platform
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

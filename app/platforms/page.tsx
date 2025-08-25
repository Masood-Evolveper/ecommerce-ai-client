"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, Settings, LogOut, Package, TrendingUp, CheckCircle, XCircle, Link, Unlink } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

interface Platform {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  apiKey?: string
  oauthConnected?: boolean
}

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect your Shopify store to sync products",
      icon: "🛍️",
      connected: false,
    },
    {
      id: "daraz",
      name: "Daraz",
      description: "List products on Daraz marketplace",
      icon: "🏪",
      connected: false,
    },
    {
      id: "amazon",
      name: "Amazon",
      description: "Coming soon - Amazon marketplace integration",
      icon: "📦",
      connected: false,
    },
    {
      id: "noon",
      name: "Noon",
      description: "Coming soon - Noon marketplace integration",
      icon: "🌙",
      connected: false,
    },
  ])

  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [storeUrl, setStoreUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserEmail(email || "")

    // Load saved platform connections
    const savedConnections = localStorage.getItem("platformConnections")
    if (savedConnections) {
      const connections = JSON.parse(savedConnections)
      setPlatforms((prev) =>
        prev.map((platform) => ({
          ...platform,
          connected: connections[platform.id]?.connected || false,
          apiKey: connections[platform.id]?.apiKey || "",
          oauthConnected: connections[platform.id]?.oauthConnected || false,
        })),
      )
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleConnectPlatform = (platform: Platform) => {
    if (platform.id === "amazon" || platform.id === "noon") {
      alert("This platform integration is coming soon!")
      return
    }
    setSelectedPlatform(platform)
    setApiKey("")
    setApiSecret("")
    setStoreUrl("")
  }

  const handleApiKeyConnect = async () => {
    if (!selectedPlatform || !apiKey) return

    setIsConnecting(true)

    // Simulate API connection
    setTimeout(() => {
      const updatedPlatforms = platforms.map((p) =>
        p.id === selectedPlatform.id ? { ...p, connected: true, apiKey: apiKey } : p,
      )
      setPlatforms(updatedPlatforms)

      // Save to localStorage
      const connections = updatedPlatforms.reduce(
        (acc, platform) => {
          acc[platform.id] = {
            connected: platform.connected,
            apiKey: platform.apiKey,
            oauthConnected: platform.oauthConnected,
          }
          return acc
        },
        {} as Record<string, any>,
      )
      localStorage.setItem("platformConnections", JSON.stringify(connections))

      setIsConnecting(false)
      setSelectedPlatform(null)
      alert(`Successfully connected to ${selectedPlatform.name}!`)
    }, 1500)
  }

  const handleOAuthConnect = async () => {
    if (!selectedPlatform) return

    setIsConnecting(true)

    // Simulate OAuth flow
    setTimeout(() => {
      const updatedPlatforms = platforms.map((p) =>
        p.id === selectedPlatform.id ? { ...p, connected: true, oauthConnected: true } : p,
      )
      setPlatforms(updatedPlatforms)

      // Save to localStorage
      const connections = updatedPlatforms.reduce(
        (acc, platform) => {
          acc[platform.id] = {
            connected: platform.connected,
            apiKey: platform.apiKey,
            oauthConnected: platform.oauthConnected,
          }
          return acc
        },
        {} as Record<string, any>,
      )
      localStorage.setItem("platformConnections", JSON.stringify(connections))

      setIsConnecting(false)
      setSelectedPlatform(null)
      alert(`Successfully connected to ${selectedPlatform.name} via OAuth!`)
    }, 2000)
  }

  const handleDisconnect = (platform: Platform) => {
    const updatedPlatforms = platforms.map((p) =>
      p.id === platform.id ? { ...p, connected: false, apiKey: "", oauthConnected: false } : p,
    )
    setPlatforms(updatedPlatforms)

    // Update localStorage
    const connections = updatedPlatforms.reduce(
      (acc, platform) => {
        acc[platform.id] = {
          connected: platform.connected,
          apiKey: platform.apiKey,
          oauthConnected: platform.oauthConnected,
        }
        return acc
      },
      {} as Record<string, any>,
    )
    localStorage.setItem("platformConnections", JSON.stringify(connections))

    alert(`Disconnected from ${platform.name}`)
  }

  return (
    <AuthGuard>
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
            <Button variant="ghost" className="w-full justify-start text-white bg-white/10">
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
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
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

        {/* Main Content */}
        <div className="ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Platform Integration</h1>
            <p className="text-slate-600 mt-2">
              Connect your e-commerce platforms to start managing products across multiple channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform) => (
              <Card key={platform.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{platform.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription>{platform.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {platform.connected ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    {platform.connected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(platform)}
                          className="flex-1"
                        >
                          <Unlink className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnectPlatform(platform)}
                          className="flex-1"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Reconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleConnectPlatform(platform)}
                        className="flex-1"
                        disabled={platform.id === "amazon" || platform.id === "noon"}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connection Dialog */}
          <Dialog open={!!selectedPlatform} onOpenChange={() => setSelectedPlatform(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect to {selectedPlatform?.name}</DialogTitle>
                <DialogDescription>
                  Choose your preferred connection method for {selectedPlatform?.name}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="api" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="api">API Key</TabsTrigger>
                  <TabsTrigger value="oauth">OAuth</TabsTrigger>
                </TabsList>

                <TabsContent value="api" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-url">Store URL</Label>
                    <Input
                      id="store-url"
                      placeholder={selectedPlatform?.id === "shopify" ? "your-store.myshopify.com" : "Your store URL"}
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-secret">API Secret</Label>
                    <Input
                      id="api-secret"
                      type="password"
                      placeholder="Enter your API secret"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleApiKeyConnect} className="w-full" disabled={isConnecting || !apiKey}>
                    {isConnecting ? "Connecting..." : "Connect with API Key"}
                  </Button>
                </TabsContent>

                <TabsContent value="oauth" className="space-y-4">
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect securely using OAuth authentication. You'll be redirected to {selectedPlatform?.name} to
                      authorize the connection.
                    </p>
                    <Button onClick={handleOAuthConnect} className="w-full" disabled={isConnecting}>
                      {isConnecting ? "Connecting..." : `Connect with ${selectedPlatform?.name} OAuth`}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  )
}

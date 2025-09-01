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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DollarSign,
  Percent,
  Star,
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Reply,
  Flag,
} from "lucide-react";
import SideBar from "@/components/sidebar";
import {
  DarazProduct,
  DarazReviewResponse,
} from "@/interfaces/daraz.interface";

interface Review {
  id: string;
  productId: string;
  productName: string;
  platform: "shopify" | "daraz";
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  sentiment: "positive" | "negative" | "neutral";
  helpful: number;
  images?: string[];
  response?: {
    text: string;
    date: string;
  };
}

interface ProductReviewSummary {
  productId: string;
  productName: string;
  platform: "shopify" | "daraz";
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function Reviews({
  productsWithReviews,
}: {
  productsWithReviews: DarazReviewResponse[];
}) {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productSummaries, setProductSummaries] = useState<
    ProductReviewSummary[]
  >([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all-reviews");
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    setUserEmail(email || "");

    setReviews([]);
    setProductSummaries([]);
    setFilteredReviews([]);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.platform === platformFilter
      );
    }

    // Sentiment filter
    if (sentimentFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.sentiment === sentimentFilter
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const rating = Number.parseInt(ratingFilter);
      filtered = filtered.filter((review) => review.rating === rating);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, platformFilter, sentimentFilter, ratingFilter]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getSentimentBadge = (sentiment: Review["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return {
          text: "Positive",
          variant: "default" as const,
          icon: ThumbsUp,
        };
      case "negative":
        return {
          text: "Negative",
          variant: "destructive" as const,
          icon: ThumbsDown,
        };
      case "neutral":
        return { text: "Neutral", variant: "secondary" as const, icon: Meh };
      default:
        return { text: "Unknown", variant: "secondary" as const, icon: Meh };
    }
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
      {/* <div className="fixed left-0 top-0 h-full w-64 bg-[#151a37] text-white p-6">
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
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => router.push("/disputes")}
          >
            <AlertTriangle className="mr-3 h-4 w-4" />
            Disputes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => router.push("/campaigns")}
          >
            <Percent className="mr-3 h-4 w-4" />
            Campaigns
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white bg-white/10">
            <Star className="mr-3 h-4 w-4" />
            Reviews
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => router.push("/financials")}
          >
            <DollarSign className="mr-3 h-4 w-4" />
            Financials
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
      </div> */}

      <SideBar />
      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reviews Management
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor and manage customer reviews across all platforms.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="product-summaries">
              Product Summaries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-reviews" className="space-y-6">
            {/* Filters */}
            <Card>
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
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select
                    value={platformFilter}
                    onValueChange={setPlatformFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="daraz">Daraz</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={sentimentFilter}
                    onValueChange={setSentimentFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sentiments</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => {
                const sentimentBadge = getSentimentBadge(review.sentiment);
                const SentimentIcon = sentimentBadge.icon;

                return (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.customerAvatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {review.customerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                {review.customerName}
                              </h3>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {review.platform}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {renderStars(review.rating)}
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {review.productName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <SentimentIcon className="h-4 w-4" />
                            <Badge
                              variant={sentimentBadge.variant}
                              className="text-xs"
                            >
                              {sentimentBadge.text}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Review image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                      {review.response && (
                        <div className="bg-slate-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Your Response
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {review.response.date}
                            </span>
                          </div>
                          <p className="text-sm">{review.response.text}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{review.helpful} found this helpful</span>
                        </div>

                        <div className="flex gap-2">
                          {!review.response && (
                            <Button size="sm" variant="outline">
                              <Reply className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No reviews found matching your filters.
              </div>
            )}
          </TabsContent>

          <TabsContent value="product-summaries" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productSummaries.map((summary) => (
                <Card key={summary.productId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {summary.productName}
                      </CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {summary.platform}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {summary.averageRating.toFixed(1)}
                        </div>
                        {renderStars(Math.round(summary.averageRating), "md")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on {summary.totalReviews} reviews
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (summary.ratingDistribution[
                                    rating as keyof typeof summary.ratingDistribution
                                  ] /
                                    summary.totalReviews) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {
                              summary.ratingDistribution[
                                rating as keyof typeof summary.ratingDistribution
                              ]
                            }
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      View All Reviews
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED"; // Shopify possible statuses
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  description: string;
  productType: string;
  totalInventory: number;
  tags: string[];
  category: {
    id: string;
    name: string;
  };
  images: {
    src: string;
    altText: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: string; // Keep string since Shopify usually sends price as string
  }[];
}
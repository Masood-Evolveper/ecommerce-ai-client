export interface UnifiedProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  inventory: number;
  sku?: string;
  variants: number;
  images: string[];
  status: string;
  platform: "daraz" | "shopify";
}

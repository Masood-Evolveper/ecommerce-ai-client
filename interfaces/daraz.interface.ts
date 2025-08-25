export interface DarazProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  seoTags: string[];
  inventory: number;
  sku: string;
  size: string | null;
  variants: { color: string; size: string }[];
  platforms: { shopify: boolean; daraz: boolean; amazon: boolean };
  images: string[];
  isActive: boolean;
  url: string;
}

export const mapDarazResponseToProduct = (darazItem: any): DarazProduct => {
  const features: string[] = [];

  if (darazItem.attributes?.short_description_en) {
    const regex = /<li.*?>(.*?)<\/li>/g;
    let match;
    while (
      (match = regex.exec(darazItem.attributes.short_description_en)) !== null
    ) {
      features.push(match[1].replace(/<[^>]+>/g, "").trim());
    }
  }

  return {
    id: String(darazItem.item_id),
    name:
      darazItem.attributes?.name_en || darazItem.attributes?.name || "Untitled",
    category: String(darazItem.primary_category),
    description:
      darazItem.attributes?.description?.replace(/<[^>]+>/g, "").trim() || "",
    features,
    seoTags: [
      darazItem.attributes?.name_en,
      darazItem.attributes?.brand,
      String(darazItem.primary_category),
    ].filter(Boolean),
    inventory:
      darazItem.skus?.reduce(
        (sum: number, sku: any) => sum + (sku.quantity || 0),
        0
      ) || 0,
    sku: darazItem.skus?.[0]?.SellerSku || "",
    url: darazItem.skus?.[0]?.Url || "",
    size: darazItem.attributes?.size || null,
    variants:
      darazItem.skus?.map((sku: any) => ({
        color: sku.saleProp?.color || "",
        size: sku.saleProp?.size || "",
      })) || [],
    platforms: {
      shopify: false,
      daraz: true,
      amazon: false,
    },
    images: darazItem.images || [],
    isActive: darazItem.status?.toLowerCase() === "active",
  };
};

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  price: string;
  inventory: string;
}

export interface ProductImage {
  id: string;
  url: string;
  file: File;
}

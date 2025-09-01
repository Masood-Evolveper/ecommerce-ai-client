import { fetchDarazCategoryById } from "@/app/server";

export interface DarazReviewRatings {
  seller_rating: string; // e.g., "5"
  overall_rating: string; // e.g., "2"
  logistics_rating: string; // e.g., "4"
  product_rating: string; // e.g., "2"
}

export interface DarazReviewVideo {
  video_url: string;
  video_cover_url: string;
}

export interface DarazReview {
  id: string;
  order_id: string;
  product_id: string;
  review_content: string;
  review_type: string; // e.g., "PRODUCT_REVIEW"
  seller_reply?: string;
  create_time: string; // epoch in ms as string
  submit_time: string; // epoch in ms as string
  can_reply: string; // "true" | "false"
  review_images: string[]; // array of image URLs (if any)
  review_videos: DarazReviewVideo[];
  ratings: DarazReviewRatings;
}

export interface DarazReviewResponse {
  product: any;
  reviews: DarazReview[];
}

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
  reviews: DarazReview[];
}

export interface DarazAddress {
  country: string;
  address1: string;
  address2: string;
  address3?: string;
  address4?: string;
  address5?: string;
  city: string;
  post_code: string;
  phone: string;
  phone2?: string;
  first_name: string;
  last_name: string;
}

export interface DarazOrder {
  voucher_platform: string;
  warehouse_code: string;
  voucher: string;
  order_number: string;
  voucher_seller: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  voucher_code?: string;
  gift_option: string; // "true" | "false"
  shipping_fee_discount_platform: string;
  shipping_fee_discount_seller: string;
  shipping_fee_original: string;
  shipping_fee: string;
  promised_shipping_times: string;
  customer_first_name: string;
  customer_last_name: string;
  price: string;
  payment_method: string;
  address_updated_at?: string | null;
  buyer_note?: string;
  national_registration_number1?: string;
  branch_number?: string;
  tax_code?: string;
  items_count: string;
  delivery_info?: string;
  statuses: string[];
  address_billing: DarazAddress;
  address_shipping: DarazAddress;
  extra_attributes?: string | null;
  order_id: string;
  gift_message?: string;
  remarks?: string;
  platform?: string;
}

/////////////////// Reverse Order Interfaces for Disputes //////////////////////////

export interface DarazReverseOrder {
  data: {
    reverse_order_id: string;
    request_type: string; // e.g. "CANCEL"
    reverseOrderLineDTOList: ReverseOrderLineDTO[];
    shipping_type: string; // e.g. "PICK_UP"
    is_rtm: string; // "true" | "false" as string
    trade_order_id: string;
  };
}

export interface ProductDTO {
  product_id: string;
  sku: string;
}

export interface BuyerInfo {
  user_id: string;
}

export interface ReverseOrderLineDTO {
  platform_sku_id: string;
  return_order_line_gmt_create: string;
  is_need_refund: string; // "true" | "false"
  trade_order_gmt_create: string;
  reason_text: string; // e.g. "Out of stock"
  item_unit_price: string;
  return_order_line_gmt_modified: string;
  trade_order_line_id: string;
  seller_sku_id: string;
  ofc_status: string; // e.g. "INITIAL"
  productDTO: ProductDTO;
  refund_payment_method: string; // e.g. "Alipay"
  buyer: BuyerInfo;
  reason_code: string;
  whqc_decision: string; // e.g. "scrap"
  reverse_status: string; // e.g. "REQUEST_INITIATE"
  refund_amount: string;
  tracking_number: string;
  is_dispute: string; // "true" | "false"
  reverse_order_line_id: string;
}

export interface DarazShipmentTracking {
  lastMileShippingProvider: string;
  packageCode: string;
  timeline: ShipmentTimeline[];
  firstMileShippingProvider: string;
  trackingNumber: string;
  destinationCountry: string;
  status: string; // e.g. "package_ready_to_be_shipped"
}

export interface ShipmentTimeline {
  shippingProvider: string; // e.g. "PK-TCS-FDS"
  recipientType: string; // e.g. "doorstep"
  trackingUrl: string;
  vehicleNumber: string;
  location: string;
  driverName: string;
  reasonCode: string; // e.g. "customer_reject_at_door_step"
  photos: string; // comma-separated URLs
  processTime: string; // timestamp as string
  status: string; // e.g. "domestic_delivered"
  epod: string; // comma-separated URLs
  driverContact: string;
}

export const mapDarazResponseToProduct = async (
  darazItem: any
): Promise<DarazProduct> => {
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

  // for(const product of darazAllProductsNormalized) {
  const categoryRes = await fetchDarazCategoryById(
    Number(darazItem.primary_category)
  );
  console.log("Category Response:", categoryRes);
  // if(category) product.category = category.name;
  // }

  return {
    id: String(darazItem.item_id),
    name:
      darazItem.attributes?.name_en || darazItem.attributes?.name || "Untitled",
    category: categoryRes?.name || "",
    // String(darazItem.primary_category),
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
    reviews: [],
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

// export interface DarazPayoutStatement {
//   subtotal2: string;
//   subtotal1: string;
//   shipment_fee_credit: string;
//   payout: string; // e.g. "0.00 PKR"
//   item_revenue: string;
//   created_at: string; // ISO datetime string
//   other_revenue_total: string;
//   fees_total: string;
//   refunds: string;
//   guarantee_deposit: string;
//   fees_on_refunds_total: string;
//   updated_at: string; // may be empty string if not updated
//   closing_balance: string;
//   paid: string; // "0" or "1"
//   opening_balance: string;
//   statement_number: string;
//   shipment_fee: string;
// }

export interface ParsedDarazPayoutStatement {
  subtotal2: number;
  subtotal1: number;
  shipment_fee_credit: number;
  payout: number; // in PKR
  item_revenue: number;
  created_at: Date;
  other_revenue_total: number;
  fees_total: number;
  refunds: number;
  guarantee_deposit: number;
  fees_on_refunds_total: number;
  updated_at?: Date | null;
  closing_balance: number;
  paid: boolean;
  opening_balance: number;
  statement_number: string;
  shipment_fee: number;
}

export interface DarazOrderInfo {
  voucher_platform: number;
  voucher: number;
  warehouse_code: string;
  voucher_seller: number;
  order_number: number;
  created_at: string; // ISO string
  voucher_code: string;
  gift_option: boolean;
  shipping_fee_discount_platform: number;
  customer_last_name: string;
  promised_shipping_times: string;
  updated_at: string;
  price: string; // looks like stringified number e.g. "759.00"
  shipping_fee_original: number;
  payment_method: string;
  buyer_note: string;
  customer_first_name: string;
  shipping_fee_discount_seller: number;
  shipping_fee: number;
  national_registration_number1: string;
  branch_number: string;
  tax_code: string;
  items_count: number;
  delivery_info: string;
  statuses: string[];
  address_billing: DarazAddress;
  extra_attributes: string;
  order_id: number;
  gift_message: string;
  remarks: string;
  address_shipping: DarazAddress;
  items: DarazOrderItem[];
}
export interface DarazOrderItem {
  tax_amount: number;
  pick_up_store_info: Record<string, unknown>;
  reason: string;
  sla_time_stamp: string;
  purchase_order_id: string;
  voucher_seller: number;
  payment_time: number; // timestamp
  voucher_code_seller: string;
  voucher_code: string;
  package_id: string;
  buyer_id: number;
  variation: string;
  biz_group: number;
  voucher_code_platform: string;
  purchase_order_number: string;
  sku: string;
  gift_wrapping: string;
  invoice_number: string;
  order_type: string;
  cancel_return_initiator: string;
  shop_sku: string;
  is_reroute: number;
  stage_pay_status: string;
  sku_id: string;
  tracking_code_pre: string;
  order_item_id: number;
  shop_id: string;
  order_flag: string;
  is_fbl: number;
  name: string;
  delivery_option_sof: number;
  order_id: number;
  fulfillment_sla: string;
  status: string;
  paid_price: number;
  product_main_image: string;
  voucher_platform: number;
  product_detail_url: string;
  promised_shipping_time: string;
  warehouse_code: string;
  shipping_type: string;
  created_at: string;
  supply_price: number;
  mp3_order: boolean;
  voucher_seller_lpi: number;
  shipping_fee_discount_platform: number;
  personalization: string;
  wallet_credits: number;
  updated_at: string;
  currency: string;
  shipping_provider_type: string;
  shipping_fee_original: number;
  voucher_platform_lpi: number;
  is_digital: number;
  item_price: number;
  shipping_service_cost: number;
  tracking_code: string;
  shipping_fee_discount_seller: number;
  shipping_amount: number;
  reason_detail: string;
  return_status: string;
  semi_managed: boolean;
  shipment_provider: string;
  priority_fulfillment_tag: string;
  voucher_amount: number;
  supply_price_currency: string;
  digital_delivery_info: string;
  extra_attributes: string;
}
// export interface DarazAddress {
//   country: string;
//   address1: string;
//   address2: string;
//   address3: string;
//   address4?: string;
//   address4address4?: string; // noticed this typo in your data
//   address5?: string;
//   city: string;
//   post_code: string;
//   phone: string;
//   phone2: string;
//   first_name: string;
//   last_name: string;
// }
"use server";

import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Express } from "express";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

///////////////////// DARAZ MAIN SERVER ///////////////////////
export const fetchDarazAllCategories = async () => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_all_categories`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Daraz categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const fetchDarazCategoryById = async (categoryId: number) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_category_by_id?category_id=${categoryId}`
      // {
      //   params: { category_id: categoryId },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category attributes:", error);
    throw new Error("Failed to fetch category attributes");
  }
};

export const fetchDarazCategoryChildren = async (categoryId: number) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_category_children`,
      {
        params: { category_id: categoryId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category attributes:", error);
    throw new Error("Failed to fetch category attributes");
  }
};

export const fetchDarazCategoryAttributes = async (categoryId: string) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_category_attributes`,
      {
        params: { category_id: categoryId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category attributes:", error);
    throw new Error("Failed to fetch category attributes");
  }
};

export const fetchDarazProducts = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_all_products`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const fetchDarazAllProductReviews = async (
  accessToken: string,
) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_all_product_reviews`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all products reviews:", error);
  }
};

export const fetchDarazProductReviews = async (
  accessToken: string,
  productId: string
) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_product_reviews?item_id=${productId}`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
  }
};

export const fetchDarazOrders = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_all_orders`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log("fetchDarazOrders response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

export const fetchDarazOrdersInfo = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_orders_with_items`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders info:", error);
    throw new Error("Failed to fetch orders info");
  }
};

export const fetchDarazOrderTraceInfo = async (
  accessToken: string,
  orderId: string
) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/trace_order?order_id=${orderId}`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order trace info:", error);
    throw new Error("Failed to fetch order trace info");
  }
};

export const fetchDarazOrderLogisticsDetails = async (
  accessToken: string,
  orderId: string
) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_order_logistics_details?order_id=${orderId}`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order logistics details info:", error);
    throw new Error("Failed to fetch order logistics details info");
  }
};

export const fetchDarazReverseOrdersInfo = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_all_reverse_orders_info`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reverse orders info:", error);
    throw new Error("Failed to reverse orders info");
  }
};

export const fetchDarazSellerPayoutStatement = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${process.env.DARAZ_API_BASE_URL}/get_payout`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching info:", error);
    throw new Error("Failed to reverse orders info");
  }
};

export const storeProductImage = async (file: File) => {
  try {
    const filePath = `daraz/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      throw new Error("Failed to upload image to Supabase");
    }

    // Get public URL
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;
    console.log("Supabase public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error storing product image:", error);
    throw new Error("Failed to store product image");
  }
};

export const migrateDarazProductImage = async (
  accessToken: string,
  image: File
) => {
  try {
    const imageUrl = await storeProductImage(image);
    console.log(imageUrl);
    // Call Python API with image URL
    const response = await axios.post(
      `${process.env.DARAZ_API_BASE_URL}/migrate_image`,
      { image_url: imageUrl },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data);
    return response.data.data.image.url;
  } catch (error) {
    console.error("Error migrating Daraz product image:", error);
    throw new Error("Failed to migrate Daraz product image");
  }
};

export const listDarazProduct = async (
  accessToken: string,
  product: any,
  images: File[]
) => {
  try {
    // Migrate images
    product.Images = await Promise.all(
      images.map((image: File) => migrateDarazProductImage(accessToken, image))
    );
    product.Skus[0].Images = product.Images;
    product.Attributes["title"] = product.Attributes["name"];
    console.log("Migrated Images:", product.Images);
    const response = await axios.post(
      `${process.env.DARAZ_API_BASE_URL}/create_new_product`,
      product,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating daraz product:", error);
    throw new Error("Failed to create daraz product");
  }
};

///////////////////// BACKEND SERVER ///////////////////////
export const generateProductListing = async (
  // accessToken: string,
  image: File
) => {
  try {
    const imageUrl = await storeProductImage(image);
    const response = await axios.post(
      `${process.env.API_BASE_URL}/agent/generateProductListing`,
      {
        // productImage: imageResponse.data.image.url,
        productImage: imageUrl,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating product listing:", error);
    throw new Error("Failed to generate product listing");
  }
};

import ProductList from "@/components/inventory";
import {
  fetchDarazCategoryById,
  fetchDarazCategoryChildren,
  fetchDarazProducts,
  fetchShopifyProducts,
} from "../server";
import {
  DarazProduct,
  mapDarazResponseToProduct,
} from "@/interfaces/daraz.interface";
import { UnifiedProduct } from "@/interfaces/product.interface";
import { mapDarazToUnified, mapShopifyToUnified } from "@/lib/utils";

export default async function page() {
  const response = await fetchDarazProducts(
    process.env.ABD_ACCESS_TOKEN as string
  );
  const darazAllProductsRaw = response.data.products;
  const darazAllProductsNormalized: DarazProduct[] = await Promise.all(
    darazAllProductsRaw.map((item: any) => mapDarazResponseToProduct(item))
  );
  const shopifyProducts = await fetchShopifyProducts();
  console.log("Shopify Products: ", shopifyProducts);
  console.log("daraz: ", darazAllProductsNormalized);

   const unifiedProducts: UnifiedProduct[] = [
    ...darazAllProductsNormalized.map(mapDarazToUnified),
    ...shopifyProducts.map(mapShopifyToUnified),
  ];

  console.log("Unified Products: ", unifiedProducts);

  return (
    <>
      <ProductList products={unifiedProducts} />
    </>
  );
}

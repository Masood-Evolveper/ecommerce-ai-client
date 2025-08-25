import ProductList from "@/components/inventory";
import { fetchDarazCategoryById, fetchDarazCategoryChildren, fetchDarazProducts } from "../server";
import { DarazProduct, mapDarazResponseToProduct } from "@/interfaces/daraz.interface";

export default async function page() {
  const response = await fetchDarazProducts(
    "50000701541aaPuenvdWTjYEhSgorvgGePh2evsCGwlxrARwpmS7x1369996b3"
  );
  const darazAllProductsRaw = response.data.products;
  const darazAllProductsNormalized: DarazProduct[] = darazAllProductsRaw.map(mapDarazResponseToProduct);

  darazAllProductsNormalized.map(async (product) => {
    const categoryResponse = await fetchDarazCategoryById(Number(product.category));
    console.log("Category Response:", categoryResponse);
    product.category = categoryResponse.name;
  });
  // const categoryResponse = await fetchDarazCategoryChildren(darazAllProductsNormalized)
  return (
    <>
      <ProductList darazAllProducts={darazAllProductsNormalized} />
    </>
  );
}

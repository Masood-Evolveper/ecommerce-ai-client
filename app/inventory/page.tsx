import ProductList from "@/components/inventory";
import {
  fetchDarazCategoryById,
  fetchDarazCategoryChildren,
  fetchDarazProducts,
} from "../server";
import {
  DarazProduct,
  mapDarazResponseToProduct,
} from "@/interfaces/daraz.interface";

export default async function page() {
  const response = await fetchDarazProducts(
    process.env.ABD_ACCESS_TOKEN as string
  );
  const darazAllProductsRaw = response.data.products;
  const darazAllProductsNormalized: DarazProduct[] = await Promise.all(
    darazAllProductsRaw.map((item: any) => mapDarazResponseToProduct(item))
  );
  // darazAllProductsNormalized.map(async (product) => {
  //   console.log(product)
  //   const categoryResponse = await fetchDarazCategoryById(Number(product.category));
  //   console.log("Category Response:", categoryResponse);
  //   product.category = categoryResponse.name;
  // });
  // const categoryResponse = await fetchDarazCategoryChildren(darazAllProductsNormalized)
  // for(const product of darazAllProductsNormalized) {
  //   const category = await fetchDarazCategoryById(Number(product.category));
  //   console.log("Category Response:", category);
  //   if(category) product.category = category.name;
  // }

  console.log("daraz: ", darazAllProductsNormalized);

  return (
    <>
      <ProductList darazAllProducts={darazAllProductsNormalized} />
    </>
  );
}

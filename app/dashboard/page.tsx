import {
  DarazOrderInfo,
  DarazProduct,
  mapDarazResponseToProduct,
  ParsedDarazPayoutStatement,
} from "@/interfaces/daraz.interface";
import {
  fetchDarazAllCategories,
  fetchDarazOrdersInfo,
  fetchDarazProducts,
  fetchDarazSellerPayoutStatement,
} from "../server";
import Dashboard from "@/components/dashboard";

export default async function page() {
  const payoutData: ParsedDarazPayoutStatement[] =
    await fetchDarazSellerPayoutStatement(
      process.env.ABD_ACCESS_TOKEN as string
    );
  console.dir(payoutData, { depth: null });

  // const response = await fetchDarazProducts(
  //   process.env.ABD_ACCESS_TOKEN as string
  // );
  // const darazAllProductsRaw = response.data.products;
  // const darazAllProductsNormalized: DarazProduct[] = await Promise.all(
  //   darazAllProductsRaw.map((item: any) => mapDarazResponseToProduct(item))
  // );
  const ordersInfo: DarazOrderInfo[] = await fetchDarazOrdersInfo(
    process.env.ABD_ACCESS_TOKEN as string
  );
  console.dir(ordersInfo, { depth: null });
  return (
    <>
      <Dashboard payoutData={payoutData} orders={ordersInfo}/>
    </>
  );
}

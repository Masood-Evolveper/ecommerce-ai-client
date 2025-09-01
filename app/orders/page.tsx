import ListOrders from "@/components/orders";
import { fetchDarazOrders, fetchShopifyOrders } from "../server";
import { DarazOrder } from "@/interfaces/daraz.interface";

export default async function page() {
  const response = await fetchDarazOrders(
    process.env.ABD_ACCESS_TOKEN as string
  );
  const darazAllOrdersRaw: DarazOrder[] = response;
  console.log("Orders Response: ", darazAllOrdersRaw);
  console.log("Orders Response: ", darazAllOrdersRaw[0].statuses[0]);


  const shopifyOrders = await fetchShopifyOrders();

  const shopifyAllOrdersRaw: ShopifyOrder[] = shopifyOrders;
  console.log("Shopify Orders: ", shopifyOrders);


  return (
    <>
      <ListOrders orders={darazAllOrdersRaw} />
    </>
  );
}

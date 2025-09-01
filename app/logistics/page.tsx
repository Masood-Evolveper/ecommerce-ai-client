import Logistics from "@/components/logistics";
import {
  fetchDarazOrderLogisticsDetails,
  fetchDarazOrders,
  fetchDarazOrderTraceInfo,
} from "../server";
import { DarazOrder, DarazShipmentTracking } from "@/interfaces/daraz.interface";

export default async function page() {
  const response = await fetchDarazOrders(
    process.env.ABD_ACCESS_TOKEN as string
  );
  const darazAllOrders: DarazOrder[] = response.data.orders;
  console.log("Orders Response: ", darazAllOrders);

  const ordersWithLogisticsDetails: DarazShipmentTracking[] = await Promise.all(
    darazAllOrders.map((order) =>
      fetchDarazOrderLogisticsDetails(
        process.env.ABD_ACCESS_TOKEN as string,
        order.order_id
      )
    )
  );
  console.log(ordersWithLogisticsDetails);

  return (
    <>
      <Logistics ordersTraceInfo={ordersWithLogisticsDetails} />
    </>
  );
}

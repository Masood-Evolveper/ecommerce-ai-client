import Logistics from "@/components/logistics";
import { fetchDarazOrders, fetchDarazOrderTraceInfo, fetchDarazReverseOrdersInfo } from "../server";
import { DarazOrder, DarazReverseOrder } from "@/interfaces/daraz.interface";
import DisputesPage from "@/components/disputes";

export default async function page() {
  const response = await fetchDarazReverseOrdersInfo(
      "50000701541aaPuenvdWTjYEhSgorvgGePh2evsCGwlxrARwpmS7x1369996b3"
    );
    const darazAllReverseOrders: DarazReverseOrder[] = response.data;
    console.log("Reverse Orders Response: ", darazAllReverseOrders);

  // const ordersWithTracingInfo = await Promise.all(darazAllReverseOrders.map((order) => fetchDarazOrderTraceInfo("50000701541aaPuenvdWTjYEhSgorvgGePh2evsCGwlxrARwpmS7x1369996b3", order.order_id)))
  // console.log(ordersWithTracingInfo);

  return (
    <>
    <DisputesPage reverseOrdersInfo={darazAllReverseOrders}/>
    </>
  );
}
import ListProduct from "@/components/list-product";
import { fetchDarazAllCategories } from "../server";

export default async function page() {
    const response = await fetchDarazAllCategories();
    console.log("Categories Response: ");
    console.dir(response, { depth: null });
  return (
    <>
      <ListProduct categories={response} />
    </>
  );
}

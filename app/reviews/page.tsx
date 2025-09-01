import { fetchDarazAllProductReviews, fetchDarazProducts } from "../server";
import {
  DarazProduct,
  DarazReviewResponse,
  mapDarazResponseToProduct,
} from "@/interfaces/daraz.interface";
import Reviews from "@/components/reviews";

// export default async function page() {
//   const allProductsReviews: DarazReviewResponse[] =
//     await fetchDarazAllProductReviews(process.env.ABD_ACCESS_TOKEN as string);
//   // const darazAllProductsRaw = allProductsReviews;
//   const darazAllProductsNormalized: DarazProduct[] = await Promise.all(
//     allProductsReviews.map((item) => mapDarazResponseToProduct(item.product))
//   );
//   allProductsReviews.forEach((productReview, index) => {
//     productReview.product = darazAllProductsNormalized[index];
//   });

//   console.dir(allProductsReviews, { depth: null });

//   return (
//     <>
//       <Reviews productsWithReviews={allProductsReviews} />
//     </>
//   );
// }

export default async function page() {
  const allProductsReviews: DarazReviewResponse[] =
    await fetchDarazAllProductReviews(process.env.ABD_ACCESS_TOKEN as string);

  // Normalize + merge in one pass
  const productsWithNormalized = await Promise.all(
    allProductsReviews.map(async (review) => {
      const normalizedProduct = await mapDarazResponseToProduct(review.product);
      return {
        ...review,
        product: normalizedProduct,
      };
    })
  );

  console.dir(productsWithNormalized, { depth: null });

  return (
    <>
      <Reviews productsWithReviews={productsWithNormalized} />
    </>
  );
}

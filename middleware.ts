import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware();

const isProtectedRoute = createRouteMatcher([
  "/", // protect home page
  "/dashboard(.*)", // protect dashboard
]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();
//   console.log("userId from middleware: ", userId);
//   // if(isProtectedRoute(req)) {
//   if (isProtectedRoute(req) && !userId) {
//     // user not signed in → redirect to /sign-in
//     const signInUrl = new URL("/auth/login", req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   // user signed in → continue
//   return NextResponse.next();
// });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
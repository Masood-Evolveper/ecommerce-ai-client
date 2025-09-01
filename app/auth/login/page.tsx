import Login from "@/components/login";
import { auth } from "@clerk/nextjs/server";

export default async function page() {
  const {userId} = await auth()
  console.log("userId from page.tsx: ", userId);
  return (
    <>
      <Login />
    </>
  );
}

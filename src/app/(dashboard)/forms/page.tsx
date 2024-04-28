import { Suspense } from "react";
import Forms from "./forms";
import Loading from "./loading";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  return (
    <Suspense fallback={<Loading />}>
      <Forms />
    </Suspense>
  );
};

export default Page;

import { Suspense } from "react";
import Loading from "./loading";
import Dashboard from "./dashboard";

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
};

export default Page;

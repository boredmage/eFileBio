import { Suspense } from "react";
import Forms from "./forms";
import Loading from "./loading";

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <Forms />
    </Suspense>
  );
};

export default Page;

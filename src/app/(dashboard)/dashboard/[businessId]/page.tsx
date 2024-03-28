import { Suspense } from "react";
import Business from "./business";
import Loading from "./loading";

const page = ({ params }: { params: { businessId: string } }) => {
  return (
    <Suspense fallback={<Loading />}>
      <Business params={params} />
    </Suspense>
  );
};

export default page;

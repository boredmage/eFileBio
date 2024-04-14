import { Suspense } from "react";
import Form from "./form";
import Loading from "./loading";

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <Form />
    </Suspense>
  );
};

export default Page;

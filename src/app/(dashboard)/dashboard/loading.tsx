import { Skeleton } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-[220px] w-full rounded-xl" />
      <Skeleton className="h-[220px] w-full rounded-xl" />
    </div>
  );
};

export default Loading;

import { Skeleton } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Skeleton className="h-[220px] w-full rounded-xl" />
      <Skeleton className="h-[220px] w-full rounded-xl" />
    </div>
  );
};

export default Loading;

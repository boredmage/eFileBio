import { Skeleton } from "@nextui-org/react";
import React from "react";

const Loading = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 9 }, (_, i) => (
        <FormListLoader key={i} />
      ))}
    </div>
  );
};

export const FormListLoader = () => (
  <div className="space-y-2">
    <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FFFFFF] p-3 hover:border-[#EDEDED]">
      <div className="flex w-fit gap-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div>
          <Skeleton className="mt-2 h-4 w-44 rounded-md" />
          <Skeleton className="mt-1 h-3 w-36 rounded-md" />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="mt-1 h-3 w-24 rounded-md" />
      </div>
    </div>
  </div>
);

export default Loading;

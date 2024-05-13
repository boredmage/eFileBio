import { Button, Skeleton } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Loading = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3">
        <div className="flex w-fit gap-4">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div>
            <Skeleton className="mt-2 h-5 w-44 rounded-md" />
            <Skeleton className="mt-2 h-2 w-36 rounded-md" />
          </div>
        </div>
        <Button
          isIconOnly
          aria-label="Like"
          variant="flat"
          className="h-12 w-12"
          as={Link}
          href="/dashboard"
        >
          <ArrowLeft />
        </Button>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

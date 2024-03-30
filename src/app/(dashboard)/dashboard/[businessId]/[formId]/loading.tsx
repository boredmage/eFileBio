import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Progress, Skeleton } from "@nextui-org/react";

import FormTab from "../../components/form-tab";

const Loading = () => {
  return (
    <div className="flex h-full flex-col">
      <FormTab activeTab={0} />

      <div className="flex flex-1 flex-col rounded-b-2xl bg-white p-4">
        <div className="space-y-4">
          <Progress color="default" aria-label="Loading..." value={25} />
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
        </div>
        <div className="space-y-6 py-6">
          <div>
            <Skeleton className="mt-2 h-5 w-44 rounded-md" />
            <Skeleton className="mt-2 h-2 w-80 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

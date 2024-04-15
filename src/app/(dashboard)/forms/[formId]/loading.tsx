"use client";

import React from "react";
import { FormListLoader } from "../loading";
import { Button, Spinner } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Loading = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          aria-label="Like"
          variant="flat"
          className="h-12 w-12"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>
        <div className="flex-grow">
          <FormListLoader />
        </div>
      </div>
      <div className="mt-60 flex items-center justify-center">
        <Spinner label="Loading..." color="warning" />
      </div>
    </div>
  );
};

export default Loading;

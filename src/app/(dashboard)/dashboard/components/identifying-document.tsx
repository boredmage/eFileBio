import { getFileSize } from "@/lib/utils";
import { Avatar, Button, Skeleton } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import React from "react";

const IdentifyingDocument = ({
  identifyingDocumentType,
  identifyingDocumentName,
  identifyingDocumentSize,
  identifyingDocumentResetHandler,
  isReadOnly,
}: {
  identifyingDocumentType: string;
  identifyingDocumentName: string;
  identifyingDocumentSize: number;
  identifyingDocumentResetHandler: () => void;
  isReadOnly?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3 md:flex-row">
      <div className="flex w-fit gap-4">
        <Avatar
          src={
            identifyingDocumentType === "application/pdf"
              ? "/pdf-logo.png"
              : "/image-logo.png"
          }
          className="mx-auto !block h-12 w-12 !rounded-md !bg-transparent text-large"
        />
        <div>
          <h2 className="text-xl font-semibold">{identifyingDocumentName}</h2>
          <p className="text-sm text-[#525252]">
            {getFileSize(identifyingDocumentSize)}
          </p>
        </div>
      </div>
      {!isReadOnly && (
        <Button
          isIconOnly
          size="lg"
          className="bg-white shadow-sm"
          onClick={identifyingDocumentResetHandler}
        >
          <Trash2 className="text-red-500" />
        </Button>
      )}
    </div>
  );
};

export const IdentifyingDocumentLoader = () => (
  <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3">
    <div className="flex w-fit gap-4">
      <Skeleton className="h-12 w-12 rounded-md" />
      <div>
        <Skeleton className="mt-2 h-5 w-44 rounded-md" />
        <Skeleton className="mt-2 h-2 w-36 rounded-md" />
      </div>
    </div>
  </div>
);

export default IdentifyingDocument;

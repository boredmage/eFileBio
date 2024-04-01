"use client";

import Icons from "@/components/icons";
import Link from "next/link";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
  Chip,
} from "@nextui-org/react";
import { EllipsisVertical } from "lucide-react";

const chipColor = {
  DRAFT: "warning",
  INREVIEW: "secondary",
  SUBMITTED: "primary",
  APPROVED: "success",
  REJECTED: "danger",
} as const;

const FormCard = ({
  formId,
  status,
  version,
  updatedAt,
  businessId,
  businessCreationDate,
}: {
  formId: string;
  status: string;
  version: number;
  updatedAt: Date;
  businessId: string;
  businessCreationDate: Date;
}) => {
  return (
    <div className="relative">
      <FormMenu />
      <Link
        className="block cursor-pointer space-y-5 rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] px-5 py-8"
        href={`/dashboard/${businessId}/${formId}`}
      >
        <Icons.SystemUpdate className="mx-auto mt-3 !block h-20 w-20 !rounded-md !bg-transparent text-large" />

        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">BOIR Version {version}</h2>
          <p className="text-center text-sm text-[#525252]">
            Last Updated -{" "}
            {updatedAt
              .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .split("/")
              .join(" / ")}
          </p>
        </div>
        <Chip
          color={chipColor[status as keyof typeof chipColor]}
          variant="dot"
          className="absolute left-4 top-2 !mt-2 border-[0.5px] text-xs"
        >
          {status}
        </Chip>
      </Link>
    </div>
  );
};

function FormMenu() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="absolute right-2 top-2 border-0"
          isIconOnly
        >
          <EllipsisVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
        <DropdownItem key="new">Duplicate Form</DropdownItem>
        <DropdownItem key="edit">Update Prior Report</DropdownItem>
        <DropdownItem key="copy">Correct Prior Report</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default FormCard;

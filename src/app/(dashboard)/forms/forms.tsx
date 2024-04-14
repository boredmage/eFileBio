import { prisma } from "@/lib/db";
import { getDueDate } from "@/lib/utils";
import { chipColor } from "@/utils/constants";
import { Avatar, Chip } from "@nextui-org/react";
import { FilingType, FillingStatus } from "@prisma/client";
import { Clock } from "lucide-react";
import Link from "next/link";
import React from "react";

export type iFormList = {
  business: {
    name: string;
    logo: string | null;
    creationDate: Date;
  };
  fi: {
    filingType: FilingType;
  } | null;
  id: string;
  version: number;
  updatedAt: Date;
  status: FillingStatus;
};

async function getForms() {
  // return new Promise((resolve) => setTimeout(resolve, 3000));
  const forms = await prisma.form.findMany({
    select: {
      id: true,
      business: {
        select: {
          name: true,
          logo: true,
          creationDate: true,
        },
      },
      fi: {
        select: {
          filingType: true,
        },
      },
      status: true,
      version: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return forms;
}

const Forms = async () => {
  const formList = await getForms();

  return (
    <div className="space-y-2">
      {formList.map((form) => (
        <FormCard
          key={form.id}
          id={form.id}
          status={form.status}
          version={form.version}
          fi={form.fi}
          business={form.business}
          updatedAt={form.updatedAt}
        />
      ))}
    </div>
  );
};

const FormCard = (props: iFormList) => {
  const { business, id, status, updatedAt, version, fi } = props;
  const { logo, name, creationDate } = business;

  const initialBusinessDueDate = getDueDate(
    creationDate.toLocaleDateString("en-US"),
  );

  return (
    <Link
      href={`/forms/${id}`}
      className="flex cursor-pointer items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FFFFFF] p-3 hover:border-[#EDEDED]"
    >
      <div className="flex w-fit gap-4">
        <Avatar
          src={logo ?? ""}
          className="mx-auto !block h-12 w-12 !rounded-md !bg-transparent text-large"
        />
        <div>
          <h2 className="text-base font-semibold">{name}</h2>
          <p className="text-sm">BOIR Version {version}</p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center">
        {status === "DRAFT" && fi?.filingType === "INITIAL" ? (
          <Chip
            startContent={<Clock size={18} />}
            variant="flat"
            color={
              initialBusinessDueDate > 10
                ? "success"
                : initialBusinessDueDate > 0
                  ? "warning"
                  : "danger"
            }
            className="text-xs uppercase"
          >
            {initialBusinessDueDate > 0
              ? `Due in ${initialBusinessDueDate} days`
              : `${+initialBusinessDueDate} days overdue`}
          </Chip>
        ) : (
          <Chip
            color={chipColor[status as keyof typeof chipColor]}
            variant="dot"
            className="border-[0.5px] text-xs"
          >
            {status === "INREVIEW" ? "IN-REVIEW" : status}
          </Chip>
        )}
        <span className="text-sm text-[#525252]">
          {updatedAt
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .split("/")
            .join(" / ")}
        </span>
      </div>
    </Link>
  );
};

export default Forms;

import { Avatar } from "@nextui-org/react";
import { Business } from "@prisma/client";
import Link from "next/link";

const BusinessCard = ({ business }: { business: Business }) => {
  return (
    <Link
      className="cursor-pointer space-y-4 rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] px-5 py-8"
      href={`/dashboard/${business.id}`}
    >
      <Avatar
        src={business.logo ?? ""}
        className="mx-auto !block h-16 w-16 !rounded-md !bg-transparent text-large"
      />

      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">{business.name}</h2>
        <p className="text-center text-sm text-[#525252]">
          {business.description}
        </p>
      </div>
    </Link>
  );
};

export default BusinessCard;

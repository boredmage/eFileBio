import { prisma } from "@/lib/db";
import { Avatar, Button } from "@nextui-org/react";
// import { Form } from "@prisma/client";
import { ArrowLeft } from "iconsax-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import FormCard from "../components/form-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { FilingType, FillingStatus } from "@prisma/client";

interface Form {
  id: string;
  updatedAt: Date;
  version: number;
  status: FillingStatus;
  fi: { filingType: FilingType } | null;
}

async function getBusiness(businessId: string, userId: string) {
  const res = await prisma.business.findUnique({
    where: {
      id: businessId,
      ownerId: userId,
    },

    select: {
      id: true,
      name: true,
      logo: true,
      forms: {
        select: {
          id: true,
          status: true,
          version: true,
          updatedAt: true,
          fi: {
            select: {
              filingType: true,
            },
          },
        },
        orderBy: {
          version: "desc",
        },
      },
      description: true,
      creationDate: true,
    },
  });

  return res;
}

const Business = async ({ params }: { params: { businessId: string } }) => {
  const { businessId } = params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user || !user.id) {
    return redirect("/");
  }

  const business = await getBusiness(businessId, user.id);

  if (!business) {
    return redirect("/dashboard");
  }

  const businessForms: Form[] = business.forms;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3">
        <div className="flex w-fit gap-4">
          <Avatar
            src={business.logo ?? ""}
            className="mx-auto !block h-12 w-12 !rounded-md !bg-transparent text-large"
          />
          <div>
            <h2 className="text-xl font-semibold">{business.name}</h2>
            <p className="text-sm">{business.description}</p>
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
          {businessForms.map((form) => (
            <FormCard
              key={form.id}
              formId={form.id}
              type={form.fi?.filingType}
              status={form.status}
              version={form.version}
              businessId={businessId}
              updatedAt={form.updatedAt}
              businessCreationDate={business.creationDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Business;

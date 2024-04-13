import { Suspense } from "react";
import Form from "./form";
import Loading from "./loading";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";
import { Business, Form as FormType } from "@prisma/client";
import { iFullFormType } from "@/types";

async function getFormData(
  businessId: string,
  formId: string,
  ownerId: string,
) {
  const formData = await prisma.form.findUnique({
    where: {
      id: formId,
      business: {
        ownerId,
        id: businessId,
      },
    },
    include: {
      business: true,
      fi: true,
      rc: true,
      ca: {
        include: {
          identification: true,
          identifyingDocument: true,
        },
      },
      bo: {
        include: {
          identification: true,
          identifyingDocument: true,
        },
      },
    },
  });

  return formData;
}

const page = async ({
  params,
}: {
  params: { businessId: string; formId: string };
}) => {
  const { businessId, formId } = params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user || !user.id) {
    return redirect("/");
  }

  const formData = await getFormData(businessId, formId, user.id);

  if (!formData) {
    return redirect("/dashboard");
  }

  const form: iFullFormType = formData;
  const business: Business = formData.business;

  return (
    <Suspense fallback={<Loading />}>
      <Form params={params} form={form} business={business} />
    </Suspense>
  );
};

export default page;

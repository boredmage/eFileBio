import { Suspense } from "react";
import Form from "./form";
import Loading from "./loading";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

async function getFormData(formId: string) {
  const formData = await prisma.form.findUnique({
    where: {
      id: formId,
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

const Page = async ({ params }: { params: { formId: string } }) => {
  const { formId } = params;
  const formData = await getFormData(formId);
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  if (!formData) {
    return redirect("/forms");
  }

  const { business, ...form } = formData;

  return (
    <Suspense fallback={<Loading />}>
      <Form form={form} business={formData?.business} />
    </Suspense>
  );
};

export default Page;

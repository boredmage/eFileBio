"use client";

import FormSteps from "../../dashboard/[businessId]/[formId]/form-steps";
import { iFormType } from "../../dashboard/[businessId]/[formId]/form";
import { useFormik } from "formik";
import { iFullFormType } from "@/types";
import {
  boFormShape,
  caFormShape,
  fiFormShape,
  rcFormShape,
} from "../../dashboard/[businessId]/[formId]/form-shape";
import { formValidation } from "@/utils/validations";
import { Avatar, Button, Chip } from "@nextui-org/react";
import { ArrowLeft, Clock } from "lucide-react";
import { useEffect } from "react";
import { Business } from "@prisma/client";
import { chipColor } from "@/utils/constants";
import { getDueDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Form = ({
  form,
  business,
}: {
  form: iFullFormType;
  business: Business;
}) => {
  const router = useRouter();

  const initialBusinessDueDate = getDueDate(
    business?.creationDate.toLocaleDateString("en-US"),
  );

  const formData = useFormik<iFormType>({
    initialValues: {
      fi: fiFormShape,
      rc: rcFormShape,
      ca: [caFormShape],
      bo: [boFormShape],
    },
    validationSchema: formValidation,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    // console.log(JSON.stringify(form, null, 2));
    formData.setValues({
      fi: form.fi ?? fiFormShape,
      rc: form.rc ?? rcFormShape,
      ca: form.ca.length ? form.ca : [caFormShape],
      bo: form.bo.length ? form.bo : [boFormShape],
    });
  }, []);

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
        <div className="flex flex-grow items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FFFFFF] p-3">
          <div className="flex w-fit gap-4">
            <Avatar
              src={business?.logo ?? ""}
              className="mx-auto !block h-12 w-12 !rounded-md !bg-transparent text-large"
            />
            <div>
              <h2 className="text-base font-semibold">{business?.name}</h2>
              <p className="text-sm font-medium">BOIR Version {form.version}</p>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center">
            {form.status === "DRAFT" && form.fi?.filingType === "INITIAL" ? (
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
                color={chipColor[form.status as keyof typeof chipColor]}
                variant="dot"
                className="border-[0.5px] text-xs"
              >
                {form.status === "INREVIEW" ? "IN-REVIEW" : form.status}
              </Chip>
            )}
            <span className="text-xs text-[#525252]">
              {form.updatedAt
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .split("/")
                .join(" / ")}
            </span>
          </div>
        </div>
      </div>
      <div>
        <FormSteps.FormStep1
          formData={formData}
          datePrepared={form.createdAt}
          isPreview
        />
        <FormSteps.FormStep2 formData={formData} isPreview />
        <FormSteps.FormStep3 formData={formData} isPreview />
        <FormSteps.FormStep4 formData={formData} isPreview />
      </div>
    </div>
  );
};

export default Form;

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
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ArrowLeft, Clock, Dot, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Business } from "@prisma/client";
import { chipColor } from "@/utils/constants";
import { cn, getDueDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { serverUpdateFormStatus } from "@/lib/form-actions";

type iFormStatus = keyof typeof chipColor;

const statuses = Object.keys(chipColor).map((key) => {
  const id = key as iFormStatus;
  return {
    id,
    value: chipColor[id],
  };
});

const Form = ({
  form,
  business,
}: {
  form: iFullFormType;
  business: Business;
}) => {
  const router = useRouter();
  const [updatingFormStatus, setUpdatingFormStatus] = useState(false);
  const [newFormStatus, setNewFormStatus] = useState<iFormStatus>(
    form.status as iFormStatus,
  );

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
    formData.setValues({
      fi: form.fi ?? fiFormShape,
      rc: form.rc ?? rcFormShape,
      ca: form.ca.length ? form.ca : [caFormShape],
      bo: form.bo.length ? form.bo : [boFormShape],
    });
  }, []);

  const downloadForm = () => {
    const downloadObject: Partial<iFullFormType> = {
      ...form,
    };

    for (const key in downloadObject) {
      if (
        key === "id" ||
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "businessId" ||
        key === "ownerId"
      ) {
        delete downloadObject[key];
      }

      if (key === "fi" || key === "rc") {
        for (const k in downloadObject[key]) {
          if (
            k === "id" ||
            k === "createdAt" ||
            k === "updatedAt" ||
            k === "formId"
          ) {
            if (downloadObject[key]) delete downloadObject[key]![k];
          }
        }
      }

      if (key === "ca" || key === "bo") {
        downloadObject[key] = downloadObject[key]?.map((item) => {
          for (const k in item) {
            if (
              k === "id" ||
              k === "createdAt" ||
              k === "updatedAt" ||
              k === "formId" ||
              k === "identifyingDocument"
            ) {
              delete (item as any)[k];
            }
          }
          return item;
        }) as any;
      }
    }

    const data = new Blob([JSON.stringify(downloadObject, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${business.id}-${form.id}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const updateFormStatus = async () => {
    try {
      setUpdatingFormStatus(true);
      await serverUpdateFormStatus(form.id, newFormStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingFormStatus(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div className="flex w-80 items-end gap-2">
          <Select
            items={statuses}
            label="Status"
            placeholder="Select a user"
            labelPlacement="outside"
            className="max-w-xs"
            selectedKeys={[newFormStatus]}
            defaultSelectedKeys={[form.status]}
            startContent={
              <div className="relative p-2">
                <Dot
                  size={60}
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform",
                    newFormStatus === "ARCHIVED"
                      ? "text-default-400"
                      : "text-" + chipColor[newFormStatus],
                  )}
                />
              </div>
            }
            classNames={{ value: "text-xs" }}
            onSelectionChange={(selected) => {
              setNewFormStatus(
                Array.from(selected as Set<string>)[0] as iFormStatus,
              );
            }}
          >
            {(status) => (
              <SelectItem key={status.id} textValue={status.id}>
                <Chip
                  color={chipColor[status.id]}
                  variant="dot"
                  className="border-[0.5px] text-xs"
                >
                  {status.id === "INREVIEW" ? "IN-REVIEW" : status.id}
                </Chip>
              </SelectItem>
            )}
          </Select>
          {newFormStatus !== form.status && (
            <Button
              variant="solid"
              color="warning"
              className="text-sm"
              onClick={updateFormStatus}
              isLoading={updatingFormStatus}
            >
              Update
            </Button>
          )}
        </div>

        <Button
          startContent={<Download size={18} />}
          variant="shadow"
          color="warning"
          className="text-sm"
          onClick={downloadForm}
        >
          Download as JSON
        </Button>
      </div>
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
                color={chipColor[form.status as iFormStatus]}
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
        <Divider />
        <FormSteps.FormStep2 formData={formData} isPreview />
        <Divider />
        <FormSteps.FormStep3 formData={formData} isPreview />
        <Divider />
        <FormSteps.FormStep4 formData={formData} isPreview />
      </div>
    </div>
  );
};

export default Form;

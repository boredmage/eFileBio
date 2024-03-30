"use client";

import { Avatar, Button, Progress, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import FormTab from "../../components/form-tab";
import FormSteps from "./form-steps";
import { FormikProps, useFormik } from "formik";
import { fiFormInterface, rcFormInterface, caFormInterface } from "@/types";
import { formValidation } from "@/utils/validations";
import {
  boFormShape,
  caFormShape,
  fiFormShape,
  rcFormShape,
} from "./form-shape";
import { ArrowLeft, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { boFormInterface } from "@/types/form-types";
import FormCompletionModal from "../../components/form-completion-modal";
import { Business, Form as FormType } from "@prisma/client";

export type iFormType = {
  fi: fiFormInterface;
  rc: rcFormInterface;
  ca: caFormInterface[];
  bo: boFormInterface[];
};

const Form = ({
  params,
  form,
  business,
}: {
  params: { businessId: string; formId: string };
  form: FormType;
  business: Business;
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { businessId, formId } = params;
  const {
    isOpen: modalIsOpen,
    onOpen: fileOpenHandler,
    onOpenChange: modalOpenChangeHandler,
  } = useDisclosure();

  const formData = useFormik<iFormType>({
    initialValues: {
      fi: fiFormShape,
      rc: rcFormShape,
      ca: [caFormShape],
      bo: [boFormShape],
    },
    validationSchema: formValidation,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    if (businessId && formId) {
      const savedData = localStorage.getItem(
        (businessId as string).concat(formId as string),
      );

      if (savedData) {
        formData.setValues(JSON.parse(savedData));
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Saving...");
      localStorage.setItem(
        (businessId as string).concat(formId as string),
        JSON.stringify(formData.values),
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData.values]);

  const handleNext = () => {
    if (
      activeTab === 3 &&
      !formData.errors.bo &&
      !formData.errors.ca &&
      !formData.errors.fi &&
      !formData.errors.rc
    ) {
      fileOpenHandler();
    } else {
      formData.handleSubmit();
    }

    if (activeTab === 0 && !formData.errors.fi) {
      setActiveTab((currentIndex) => currentIndex + 1);
      formData.setErrors({});
      formData.setTouched({});
    } else if (activeTab === 1 && !formData.errors.rc) {
      setActiveTab((currentIndex) => currentIndex + 1);
      formData.setErrors({});
      formData.setTouched({});
    } else if (activeTab === 2 && !formData.errors.ca) {
      setActiveTab((currentIndex) => currentIndex + 1);
      formData.setErrors({});
      formData.setTouched({});
    }
  };
  const handleBack = () => setActiveTab((currentIndex) => currentIndex - 1);

  return (
    <div className="flex h-full flex-col">
      <FormTab activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1 flex-col rounded-b-2xl bg-white p-4">
        <div className="space-y-4">
          <Progress
            color="warning"
            aria-label="Loading..."
            value={(activeTab + 1) * 25}
          />
          <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3">
            <div className="flex w-fit gap-4">
              <Avatar
                src={business.logo ?? ""}
                className="mx-auto !block h-12 w-12 !rounded-md !bg-transparent text-large"
              />
              <div>
                <h2 className="text-xl font-semibold">New Business eFiling</h2>
                <p className="text-sm">
                  Create a New Business to manage eFiling
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              aria-label="Like"
              variant="flat"
              className="h-12 w-12"
              onClick={() => router.back()}
            >
              <ArrowLeft />
            </Button>
          </div>
        </div>
        <div className="flex-grow">
          {activeTab === 0 && (
            <FormSteps.FormStep1
              formData={formData as FormikProps<iFormType>}
              datePrepared={form.createdAt}
            />
          )}
          {activeTab === 1 && (
            <FormSteps.FormStep2
              formData={formData as FormikProps<iFormType>}
            />
          )}
          {activeTab === 2 && (
            <FormSteps.FormStep3
              formData={formData as FormikProps<iFormType>}
            />
          )}
          {activeTab === 3 && (
            <FormSteps.FormStep4
              formData={formData as FormikProps<iFormType>}
            />
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-4">
          <Button
            radius="full"
            onClick={handleBack}
            isDisabled={activeTab === 0}
          >
            Back
          </Button>
          <Button
            radius="full"
            color="warning"
            endContent={<MoveRight />}
            className="text-white"
            onClick={handleNext}
          >
            {activeTab === 3 ? "File BOIR" : "Next"}
          </Button>
          <FormCompletionModal
            formId={formId}
            business={business}
            isOpen={modalIsOpen}
            formVersion={form.version}
            onOpenChange={modalOpenChangeHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Form;

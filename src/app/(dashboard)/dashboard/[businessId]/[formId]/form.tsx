"use client";

import { Avatar, Button, Progress, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import FormTab from "../../components/form-tab";
import FormSteps from "./form-steps";
import { FormikProps, useFormik } from "formik";
import {
  fiFormInterface,
  rcFormInterface,
  caFormInterface,
  iFullFormType,
} from "@/types";
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
import { Business, FiForm, Form as FormType } from "@prisma/client";
import PreviewModal from "../../components/preview-modal";
import { saveForm } from "@/lib/form-actions";

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
  form: iFullFormType;
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
  const isFormReadOnly = form.status !== "DRAFT";

  const formData = useFormik<iFormType>({
    initialValues: {
      fi: fiFormShape,
      rc: rcFormShape,
      ca: [caFormShape],
      bo: [boFormShape],
    },
    validationSchema: formValidation,
    onSubmit: (values) => {
      // console.log(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    // console.log(JSON.stringify(form, null, 2));
    if (businessId && formId) {
      const savedData = localStorage.getItem(
        (businessId as string).concat(formId as string),
      );

      if (!savedData) {
        formData.setValues({
          fi: form.fi ?? fiFormShape,
          rc: form.rc ?? rcFormShape,
          ca: [caFormShape],
          bo: [boFormShape],
        });
        return;
      }
      const { fi, rc, ca, bo } = JSON.parse(savedData) as iFormType;
      const fiEntry = fi ?? fiFormShape;
      const rcEntry = rc ?? rcFormShape;
      const caEntry = ca.length ? ca : [caFormShape];
      const boEntry = bo.length ? bo : [boFormShape];

      if (form) {
        formData.setValues({
          fi: form.fi ?? fiEntry,
          rc: form.rc ?? rcEntry,
          ca: form.ca.length ? form.ca : caEntry,
          bo: form.bo.length ? form.bo : boEntry,
        });
      } else if (savedData) {
        formData.setValues({
          fi: fiEntry,
          rc: rcEntry,
          ca: caEntry,
          bo: boEntry,
        });
      } else {
        formData.setValues({
          fi: fiFormShape,
          rc: rcFormShape,
          ca: [caFormShape],
          bo: [boFormShape],
        });
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

  const handleNext = async () => {
    try {
      if (isFormReadOnly) {
        if (activeTab === 3) {
          setActiveTab(0);
        } else {
          setActiveTab((currentIndex) => currentIndex + 1);
        }
        return;
      }

      if (
        activeTab === 3 &&
        !formData.errors.bo &&
        !formData.errors.ca &&
        !formData.errors.fi &&
        !formData.errors.rc
      ) {
        await saveForm(businessId, formId, activeTab, formData.values);
        fileOpenHandler();
      } else {
        formData.handleSubmit();
      }

      if (activeTab === 0 && !formData.errors.fi) {
        setActiveTab((currentIndex) => currentIndex + 1);
        formData.setErrors({});
        formData.setTouched({});
        await saveForm(businessId, formId, activeTab, formData.values);
      } else if (activeTab === 1 && !formData.errors.rc) {
        setActiveTab((currentIndex) => currentIndex + 1);
        formData.setErrors({});
        formData.setTouched({});
        await saveForm(businessId, formId, activeTab, formData.values);
      } else if (activeTab === 2 && !formData.errors.ca) {
        setActiveTab((currentIndex) => currentIndex + 1);
        formData.setErrors({});
        formData.setTouched({});
        await saveForm(businessId, formId, activeTab, formData.values);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
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
              isPreview={isFormReadOnly}
            />
          )}
          {activeTab === 1 && (
            <FormSteps.FormStep2
              formData={formData as FormikProps<iFormType>}
              isPreview={isFormReadOnly}
            />
          )}
          {activeTab === 2 && (
            <FormSteps.FormStep3
              formData={formData as FormikProps<iFormType>}
              isPreview={isFormReadOnly}
            />
          )}
          {activeTab === 3 && (
            <FormSteps.FormStep4
              formData={formData as FormikProps<iFormType>}
              isPreview={isFormReadOnly}
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
            Save and Continue
          </Button>
          <PreviewModal
            formId={formId}
            business={business}
            isOpen={modalIsOpen}
            formVersion={form.version}
            onOpenChange={modalOpenChangeHandler}
            formContent={
              <>
                <FormSteps.FormStep1
                  formData={formData as FormikProps<iFormType>}
                  datePrepared={form.createdAt}
                  isPreview
                />
                <FormSteps.FormStep2
                  formData={formData as FormikProps<iFormType>}
                  isPreview
                />
                <FormSteps.FormStep3
                  formData={formData as FormikProps<iFormType>}
                  isPreview
                />
                <FormSteps.FormStep4
                  formData={formData as FormikProps<iFormType>}
                  isPreview
                />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
